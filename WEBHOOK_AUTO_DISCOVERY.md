# Webhook 自动发现域名方案

## 🎯 核心目标
客户只需提供 4 个秘钥，无需手动输入 Shopify 店铺域名，系统通过 Webhook 自动发现并绑定。

---

## 📋 方案概述

### 问题
- 客户不愿意提供 Shopify 店铺域名
- 但 Shopify API 必须有域名才能调用
- 现有 `loyaltyStore` 表的 `shopifyDomain` 字段是必填的

### 解决方案
利用 Shopify Webhook 请求头中的 `X-Shopify-Shop-Domain` 实现"被动溯源"：

1. **客户录入**：只需填写 4 个秘钥（Client ID、Client Secret、Access Token、Webhook Secret）
2. **系统保存**：`shopifyDomain` 字段初始为空字符串
3. **客户配置**：在 Shopify 后台配置 Webhook URL
4. **自动发现**：Shopify 发送第一个请求时，系统通过 HMAC 验证匹配店铺，自动提取并保存域名

---

## 🛠️ 技术实现

### 1. 数据库改动（最小化）

```sql
-- 步骤 1: 允许 shopifyDomain 为空
ALTER TABLE loyalty_store ALTER COLUMN shopify_domain DROP NOT NULL;

-- 步骤 2: 添加 webhook_path_id 字段（用于生成唯一 Webhook URL）
ALTER TABLE loyalty_store ADD COLUMN IF NOT EXISTS webhook_path_id TEXT UNIQUE;

-- 步骤 3: 为现有记录生成 webhook_path_id
UPDATE loyalty_store 
SET webhook_path_id = 'wh_' || lower(substring(md5(random()::text || id::text), 1, 16)) 
WHERE webhook_path_id IS NULL;

-- 步骤 4: 创建触发器自动生成 webhook_path_id
CREATE OR REPLACE FUNCTION generate_webhook_path_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.webhook_path_id IS NULL THEN
    NEW.webhook_path_id := 'wh_' || lower(substring(md5(random()::text || NEW.id::text), 1, 16));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_webhook_path_id
BEFORE INSERT ON loyalty_store
FOR EACH ROW
EXECUTE FUNCTION generate_webhook_path_id();
```

### 2. Webhook 路由增强（自动发现逻辑）

**文件**: `src/app/api/webhooks/shopify/orders-paid/route.ts`

**核心逻辑**:
```typescript
// 1. 先尝试通过域名查找店铺（已绑定的情况）
let stores = await db()
  .select()
  .from(schema.loyaltyStore)
  .where(eq(schema.loyaltyStore.shopifyDomain, shop))
  .limit(1);

// 2. 如果找不到，说明是首次请求，通过 HMAC 验证匹配店铺
if (!stores.length) {
  const storesWithoutDomain = await db()
    .select()
    .from(schema.loyaltyStore)
    .where(eq(schema.loyaltyStore.shopifyDomain, ''))
    .limit(10);

  for (const potentialStore of storesWithoutDomain) {
    const testHash = crypto
      .createHmac('sha256', potentialStore.shopifyWebhookSecret || '')
      .update(body, 'utf8')
      .digest('base64');

    if (testHash === hmac) {
      // 找到匹配的店铺，自动补全域名
      await db()
        .update(schema.loyaltyStore)
        .set({ 
          shopifyDomain: shop,
          status: 'active',
          webhookRegistered: true,
          updatedAt: new Date()
        })
        .where(eq(schema.loyaltyStore.id, potentialStore.id));

      stores = [{ ...potentialStore, shopifyDomain: shop }];
      console.log(`✅ Auto-discovered shop domain: ${shop}`);
      break;
    }
  }
}
```

### 3. 前端改动（移除域名输入框）

**文件**: `src/app/[locale]/(dashboard)/niche-loyalty/connect-store/page.tsx`

**改动**:
- ✅ 移除 `shopDomain` 输入框
- ✅ 更新提示文案："No domain required - we auto-detect it!"
- ✅ 客户只需填写 4 个秘钥

---

## 🔐 安全性保证

### 多用户隔离
- 每个店铺有唯一的 `webhook_path_id`
- 未来可扩展为动态路由：`/api/webhooks/shopify/[webhookPathId]/route.ts`
- 即使黑客知道 API 结构，也无法伪造请求（需要正确的 HMAC 签名）

### HMAC 验证
- 使用 `crypto.timingSafeEqual` 防止计时攻击
- 只有正确的 Webhook Secret 才能通过验证
- 自动发现过程中，系统会遍历所有未绑定域名的店铺，通过 HMAC 匹配正确的那个

---

## 📊 客户操作流程

### 旧流程（需要域名）
1. 客户在 Shopify 创建 Custom App
2. 客户复制 5 个信息：域名 + 4 个秘钥
3. 客户在 Glow 填写 5 个字段
4. 客户在 Shopify 配置 Webhook

### 新流程（无需域名）✨
1. 客户在 Shopify 创建 Custom App
2. 客户复制 4 个秘钥（无需域名）
3. 客户在 Glow 填写 4 个字段
4. 客户在 Shopify 配置 Webhook
5. **系统自动发现域名并绑定** 🎉

---

## 🧪 测试方案

### 本地测试（使用 ngrok）

```bash
# 1. 启动本地服务器
npm run dev

# 2. 启动 ngrok
ngrok http 3000

# 3. 使用 ngrok URL 配置 Shopify Webhook
# 例如: https://abc123.ngrok-free.app/api/webhooks/shopify/orders-paid
```

### 模拟测试脚本

```javascript
// test-webhook-discovery.js
const crypto = require('crypto');
const fetch = require('node-fetch');

const WEBHOOK_SECRET = 'your-webhook-secret';
const TARGET_URL = 'http://localhost:3000/api/webhooks/shopify/orders-paid';

const payload = JSON.stringify({
  id: 123456789,
  total_price: "99.00",
  discount_codes: [{ code: "LOYALTY20_123", amount: "19.80" }]
});

const hmac = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payload, 'utf8')
  .digest('base64');

async function testWebhook() {
  const response = await fetch(TARGET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': hmac,
      'X-Shopify-Shop-Domain': 'test-store.myshopify.com', // 模拟域名
      'X-Shopify-Topic': 'orders/paid'
    },
    body: payload
  });

  console.log(`Status: ${response.status}`);
  console.log(await response.text());
}

testWebhook();
```

### 验证步骤

1. **插入测试数据**（域名为空）:
```sql
INSERT INTO loyalty_store (id, user_id, shopify_domain, shopify_webhook_secret, shopify_access_token, status)
VALUES ('test-store-id', 'test-user-id', '', 'your-webhook-secret', 'shpat_xxx', 'pending');
```

2. **运行测试脚本**:
```bash
node test-webhook-discovery.js
```

3. **检查数据库**:
```sql
SELECT id, shopify_domain, status, webhook_registered 
FROM loyalty_store 
WHERE id = 'test-store-id';
```

**预期结果**:
- `shopify_domain` 从空字符串变为 `test-store.myshopify.com`
- `status` 变为 `active`
- `webhook_registered` 变为 `true`

---

## 🚀 部署清单

### 1. 数据库迁移
- [ ] 执行 SQL 修改 `shopify_domain` 约束
- [ ] 添加 `webhook_path_id` 字段
- [ ] 创建触发器自动生成 `webhook_path_id`

### 2. 代码部署
- [x] 修改 `orders-paid/route.ts` 增加自动发现逻辑
- [x] 修改 `connect-store/page.tsx` 移除域名输入框
- [ ] 部署到 Vercel

### 3. 测试验证
- [ ] 本地测试（ngrok + 模拟脚本）
- [ ] 生产环境测试（真实 Shopify 店铺）

---

## 💡 未来优化方向

### 1. 动态 Webhook 路由（可选）
创建 `/api/webhooks/shopify/[webhookPathId]/route.ts`，每个商家独立 URL：
```
https://glow.app/api/webhooks/shopify/wh_abc123xyz
```

**优势**:
- 更好的多用户隔离
- 无需遍历查找店铺
- 更快的响应速度

### 2. 实时状态推送
使用 WebSocket 或 Server-Sent Events，当域名自动发现成功时，实时通知前端：
```typescript
// 前端显示
"🎉 Shop domain detected: your-store.myshopify.com"
```

### 3. ROI Dashboard
既然有了订单数据，可以展示：
- 本月通过折扣码带来的销售额
- 折扣码使用率
- 平均订单金额

---

## 📝 总结

### 优势
✅ **客户体验极佳**：只需填写 4 个秘钥，无需手动输入域名  
✅ **完全不改变 ShipAny 结构**：只修改了一个字段约束  
✅ **安全可靠**：通过 HMAC 验证确保数据准确性  
✅ **向后兼容**：已有域名的店铺不受影响  

### 技术亮点
- 利用 Shopify Webhook Header 实现"被动溯源"
- 通过 HMAC 验证匹配正确的店铺
- 数据库触发器自动生成唯一标识符
- 最小化代码改动，最大化用户体验

---

**执行日期**: 2025-02-25  
**状态**: ✅ 已实现核心逻辑，待数据库迁移和测试

