# Creem 环境变量配置方案

## 📋 当前 Creem 配置信息

### API 密钥
```
creem_test_1i7654OnZ1pk67vqY87wS6
```

### Webhook 配置
```
URL: https://glownicheloyalty.vercel.app/api/webhooks/creem
Secret: whsec_6eSG4BSnIuqMtGV0yEqlF4
```

### 产品配置
```
Base 套餐 ($19.90):
  Product ID: prod_5bo10kkVzObfuZIjUglgI0
  测试链接: https://www.creem.io/test/payment/prod_5bo10kkVzObfuZIjUglgI0

Pro 套餐 ($59.90):
  Product ID: prod_1lQWMwrdWZFzo6AgpVcCc7
  测试链接: https://www.creem.io/test/payment/prod_1lQWMwrdWZFzo6AgpVcCc7
```

---

## 🔧 需要更新的环境变量

### 本地环境 (.env.local)

**当前配置**:
```bash
CREEM_API_KEY="creem_test_1i7654OnZ1pk67vqY87wS6"
CREEM_ENABLED="true"
CREEM_ENVIRONMENT="sandbox"
CREEM_PRODUCT_IDS={"glow-seed-free":"prod_free","glow-base-monthly":"prod_5bo10kkVzObfuZIjUglgI0","glow-pro-monthly":"prod_1lQWMwrdWZFzo6AgpVcCc7"}
CREEM_SIGNING_SECRET="your-creem-signing-secret"
DEFAULT_PAYMENT_PROVIDER="creem"
```

**需要更新为**:
```bash
CREEM_API_KEY="creem_test_1i7654OnZ1pk67vqY87wS6"
CREEM_ENABLED="true"
CREEM_ENVIRONMENT="sandbox"
CREEM_PRODUCT_IDS={"glow-seed-free":"prod_free","glow-base-monthly":"prod_5bo10kkVzObfuZIjUglgI0","glow-pro-monthly":"prod_1lQWMwrdWZFzo6AgpVcCc7"}
CREEM_SIGNING_SECRET="whsec_6eSG4BSnIuqMtGV0yEqlF4"
DEFAULT_PAYMENT_PROVIDER="creem"
```

**变化**: 只需要更新 `CREEM_SIGNING_SECRET`

---

## ✅ 完整的环境变量配置

### 本地开发 (.env.local)

```bash
# ============================================
# 认证配置
# ============================================
AUTH_SECRET="niche-loyalty-secret-key-production-2025"
BETTER_AUTH_SECRET="niche-loyalty-secret-key-production-2025"

# ============================================
# 数据库配置
# ============================================
DATABASE_URL="postgresql://neondb_owner:npg_cjqDLCsv1Q0r@ep-dawn-block-ahqazngy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_PROVIDER="postgresql"

# ============================================
# Creem 支付配置
# ============================================
CREEM_ENABLED="true"
CREEM_ENVIRONMENT="sandbox"
CREEM_API_KEY="creem_test_1i7654OnZ1pk67vqY87wS6"
CREEM_SIGNING_SECRET="whsec_6eSG4BSnIuqMtGV0yEqlF4"
CREEM_PRODUCT_IDS={"glow-seed-free":"prod_free","glow-base-monthly":"prod_5bo10kkVzObfuZIjUglgI0","glow-pro-monthly":"prod_1lQWMwrdWZFzo6AgpVcCc7"}
DEFAULT_PAYMENT_PROVIDER="creem"

# ============================================
# 邮件服务
# ============================================
RESEND_API_KEY="re_JrzLE2sa_HAe9ZVgzmszQ1iepVhRUS4Ci"

# ============================================
# 存储配置
# ============================================
STORAGE_PROVIDER="vercel-blob"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_nX1fso7ItwkKNw1t_5k6MllqmpuowMKtGz2OSWyK51pN5g3"

# ============================================
# 应用配置
# ============================================
NEXT_PUBLIC_APP_NAME="Glow"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🌐 Vercel 生产环境配置

### 需要在 Vercel 添加的环境变量

```bash
# 认证
AUTH_SECRET=niche-loyalty-secret-key-production-2025
BETTER_AUTH_SECRET=niche-loyalty-secret-key-production-2025

# 数据库
DATABASE_PROVIDER=postgresql

# Creem 支付
CREEM_ENABLED=true
CREEM_ENVIRONMENT=sandbox
CREEM_API_KEY=creem_test_1i7654OnZ1pk67vqY87wS6
CREEM_SIGNING_SECRET=whsec_6eSG4BSnIuqMtGV0yEqlF4
CREEM_PRODUCT_IDS={"glow-seed-free":"prod_free","glow-base-monthly":"prod_5bo10kkVzObfuZIjUglgI0","glow-pro-monthly":"prod_1lQWMwrdWZFzo6AgpVcCc7"}
DEFAULT_PAYMENT_PROVIDER=creem

# 邮件
RESEND_API_KEY=re_JrzLE2sa_HAe9ZVgzmszQ1iepVhRUS4Ci

# 存储
STORAGE_PROVIDER=vercel-blob

# 应用
NEXT_PUBLIC_APP_NAME=Glow
```

---

## 🔄 Webhook 配置验证

### Creem Dashboard 设置

1. **登录 Creem Dashboard**: https://www.creem.io/dashboard
2. **进入 Webhooks 设置**
3. **验证配置**:
   ```
   Webhook URL: https://glownicheloyalty.vercel.app/api/webhooks/creem
   Webhook Secret: whsec_6eSG4BSnIuqMtGV0yEqlF4
   ```

### 本地 Webhook 处理

**文件位置**: `src/app/api/webhooks/creem/route.ts` (如果存在)

如果不存在，系统会使用默认的 `/api/payment/notify/creem` 路由。

---

## 📊 产品价格映射

### 当前映射关系

| 套餐名称 | 价格 | Product ID | pricing.json 中的 product_id |
|---------|------|------------|------------------------------|
| Seed (免费) | $0 | prod_free | glow-seed-free |
| Base | $19.90 | prod_5bo10kkVzObfuZIjUglgI0 | glow-base-monthly |
| Pro | $59.90 | prod_1lQWMwrdWZFzo6AgpVcCc7 | glow-pro-monthly |

### 验证配置

**pricing.json** (`src/config/locale/messages/en/pricing.json`):
```json
{
  "product_id": "glow-base-monthly",
  "payment_product_id": "prod_5bo10kkVzObfuZIjUglgI0",
  "amount": 1990,
  "price": "$19.90"
}
```

**环境变量**:
```bash
CREEM_PRODUCT_IDS={"glow-base-monthly":"prod_5bo10kkVzObfuZIjUglgI0"}
```

✅ **配置已匹配！**

---

## 🧪 测试链接

### 直接测试支付

**Base 套餐 ($19.90)**:
```
https://www.creem.io/test/payment/prod_5bo10kkVzObfuZIjUglgI0
```

**Pro 套餐 ($59.90)**:
```
https://www.creem.io/test/payment/prod_1lQWMwrdWZFzo6AgpVcCc7
```

### 通过应用测试

**本地**:
```
http://localhost:3000/en/niche-loyalty/pricing
```

**生产**:
```
https://glownicheloyalty.vercel.app/en/niche-loyalty/pricing
```

---

## 🚀 执行步骤

### 步骤 1: 更新本地环境变量

```bash
cd d:\AIsoftware\niche_loyalty
```

**只需要更新一个值**:
```bash
CREEM_SIGNING_SECRET="whsec_6eSG4BSnIuqMtGV0yEqlF4"
```

### 步骤 2: 重启开发服务器

```bash
# 停止当前服务器
taskkill /F /IM node.exe

# 重新启动
npm run dev
```

### 步骤 3: 测试支付流程

1. 访问: `http://localhost:3000/en/niche-loyalty/pricing`
2. 点击 "Get Base" ($19.90)
3. 应该跳转到 Creem 支付页面
4. 使用测试卡完成支付:
   ```
   卡号: 4242 4242 4242 4242
   过期: 12/25
   CVC: 123
   ```
5. 验证跳转到 `/payment/success`

### 步骤 4: 更新 Vercel 环境变量

在 Vercel 项目设置中，更新以下变量：

```bash
CREEM_SIGNING_SECRET=whsec_6eSG4BSnIuqMtGV0yEqlF4
```

其他变量保持不变。

### 步骤 5: 重新部署

```bash
git add .
git commit -m "chore: update Creem webhook secret"
git push
```

---

## ✅ 验证清单

### 本地验证
- [ ] 环境变量已更新
- [ ] 开发服务器已重启
- [ ] 定价页面正常显示
- [ ] 点击按钮跳转到 Creem
- [ ] 测试支付成功
- [ ] 跳转到成功页面
- [ ] 订阅状态正确显示

### Vercel 验证
- [ ] 环境变量已添加
- [ ] 代码已推送
- [ ] 部署成功
- [ ] 生产环境测试通过
- [ ] Webhook 接收正常

---

## 📝 配置对比

### 之前 vs 现在

| 配置项 | 之前 | 现在 | 状态 |
|--------|------|------|------|
| CREEM_API_KEY | creem_test_1i7654OnZ1pk67vqY87wS6 | creem_test_1i7654OnZ1pk67vqY87wS6 | ✅ 不变 |
| CREEM_SIGNING_SECRET | your-creem-signing-secret | whsec_6eSG4BSnIuqMtGV0yEqlF4 | 🔄 更新 |
| CREEM_PRODUCT_IDS (Base) | prod_5bo10kkVzObfuZIjUglgI0 | prod_5bo10kkVzObfuZIjUglgI0 | ✅ 不变 |
| CREEM_PRODUCT_IDS (Pro) | prod_1lQWMwrdWZFzo6AgpVcCc7 | prod_1lQWMwrdWZFzo6AgpVcCc7 | ✅ 不变 |

**结论**: 只需要更新 `CREEM_SIGNING_SECRET` 一个值！

---

## 🎯 总结

### 需要做的事情

**非常简单！只需要 1 个更新：**

1. ✅ 更新 `CREEM_SIGNING_SECRET` 从 `your-creem-signing-secret` 到 `whsec_6eSG4BSnIuqMtGV0yEqlF4`

### 不需要改变的

- ❌ API Key 已经正确
- ❌ Product IDs 已经正确
- ❌ 其他配置都正确

### 配置完成后

1. 重启开发服务器
2. 测试支付流程
3. 更新 Vercel 环境变量
4. 重新部署

**就这么简单！** 🎉

