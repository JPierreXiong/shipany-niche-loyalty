# Webhook 自动发现方案 - 快速开始

## 🎯 核心改进

**客户只需提供 4 个秘钥，无需手动输入域名！**

系统通过 Shopify Webhook 自动发现并绑定店铺域名。

---

## 📋 快速部署（3 步）

### 步骤 1: 数据库迁移

在 Neon 控制台执行：

```sql
-- 允许域名为空（将通过 Webhook 自动发现）
ALTER TABLE loyalty_store ALTER COLUMN shopify_domain DROP NOT NULL;

-- 添加 webhook_path_id 字段（未来扩展用）
ALTER TABLE loyalty_store ADD COLUMN IF NOT EXISTS webhook_path_id TEXT UNIQUE;

-- 为现有记录生成 webhook_path_id
UPDATE loyalty_store 
SET webhook_path_id = 'wh_' || lower(substring(md5(random()::text || id::text), 1, 16)) 
WHERE webhook_path_id IS NULL;
```

### 步骤 2: 部署代码

```bash
git add .
git commit -m "feat: webhook auto-discovery - no domain input required"
git push origin main
```

### 步骤 3: 测试验证

```bash
# 本地测试
npm run dev
node test-webhook-auto-discovery.js --setup
node test-webhook-auto-discovery.js
```

---

## 🔧 已修改的文件

### 核心逻辑
1. **`src/app/api/webhooks/shopify/orders-paid/route.ts`**
   - 增加自动发现逻辑
   - 通过 HMAC 验证匹配店铺
   - 自动补全域名

2. **`src/app/[locale]/(dashboard)/niche-loyalty/connect-store/page.tsx`**
   - 移除域名输入框
   - 简化客户操作

### 新增文件
3. **`src/app/api/niche-loyalty/webhook-info/route.ts`**
   - 获取 Webhook URL
   - 返回连接状态

4. **`src/components/webhook-config-guide.tsx`**
   - 配置向导组件
   - 一键复制 URL
   - 实时状态刷新

### 文档和脚本
5. **`migrations/webhook-auto-discovery.sql`** - 数据库迁移
6. **`test-webhook-auto-discovery.js`** - 测试脚本
7. **`WEBHOOK_AUTO_DISCOVERY.md`** - 完整文档
8. **`IMPLEMENTATION_GUIDE.md`** - 实施指南

---

## 💡 工作原理

```
客户填写 4 个秘钥 → 保存到数据库（域名为空）
                ↓
客户在 Shopify 配置 Webhook
                ↓
Shopify 发送第一个请求（包含域名）
                ↓
系统通过 HMAC 验证匹配店铺
                ↓
自动补全域名并激活连接 ✅
```

---

## ✅ 优势

- **客户体验**: 减少 1 个输入步骤，降低出错率
- **技术实现**: 完全不改变 ShipAny 结构
- **安全可靠**: HMAC 验证 + 自动匹配
- **向后兼容**: 已有域名的店铺不受影响

---

## 📞 需要帮助？

查看详细文档：
- `WEBHOOK_AUTO_DISCOVERY.md` - 技术原理
- `IMPLEMENTATION_GUIDE.md` - 完整指南
- `migrations/webhook-auto-discovery.sql` - 数据库脚本

运行测试：
```bash
node test-webhook-auto-discovery.js --help
```

---

**状态**: ✅ 代码完成，待部署  
**日期**: 2025-02-25

