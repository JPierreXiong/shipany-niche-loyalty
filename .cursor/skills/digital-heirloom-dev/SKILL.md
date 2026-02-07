---
name: digital-heirloom-dev
description: >
  在不改变 ShipAny SaaS 结构框架的前提下，专注于 Digital Heirloom 功能的本地开发、
  使用 Neon PostgreSQL 进行数据库迁移与调试，以及相关问题的排查与修复。
---

# 数字遗嘱 / Digital Heirloom 开发专用 Skill

## 目标

- 所有操作 **必须严格遵守**：不改变 ShipAny SaaS 的整体结构与框架，只做功能级别扩展和配置调整。
- 默认只在当前项目中的 **Digital Heirloom 相关模块** 内工作（包括 API、数据库脚本、页面与配置）。
- 使用 **Neon PostgreSQL** 作为本地与测试环境的数据库，而不是 Supabase 提供的 Postgres 连接。

## 约束（铁律）

1. **禁止修改框架结构**
   - 不随意移动、删除或重命名核心目录，例如：
     - `src/app` 顶层路由结构
     - `src/core` 核心库
     - `src/shared` 通用组件与模型
   - 不修改 Next.js、Tailwind、ESLint 等工程基础配置的整体架构，只允许做最小必要的配置增量。

2. **禁止破坏 ShipAny 其他产品线**
   - 不改动与 Digital Heirloom 无关的业务模块（例如其他 SaaS 模块、支付流程、通用 UI 模板），除非用户有明确指令。
   - 避免对全局类型、通用组件做大范围重构；如必须改动，需要明确评估对其他模块的影响并在说明中标出。

3. **数据库相关约束**
   - 默认将 `DATABASE_URL` 指向 Neon 提供的连接串：
     - `DATABASE_URL` 使用带连接池的 Neon URL。
     - 如需要非 pgbouncer 连接，可使用 `DATABASE_URL_UNPOOLED` 或 `POSTGRES_URL_NON_POOLING`。
   - 不再使用 Supabase 的 `DATABASE_URL`，但 **保留 Supabase 的 URL / Key** 用于存储、认证等其他能力。
   - 使用 Drizzle ORM 访问 Neon 数据库，调用统一的 `db()` 方法（位于 `src/core/db/index.ts`），**不直接在业务代码中创建新的数据库客户端实例**。

## 环境假设

- 项目使用 `pnpm` 作为包管理工具。
- 根目录包含：
  - `env.digital-heirloom.example.txt`
  - `scripts/execute-digital-heirloom-migration.ts`
  - `scripts/migrate-digital-heirloom.sql`
  - `API_ROUTES_DIGITAL_HEIRLOOM.md`
- 开发环境使用 `.env.local`，由 `env.digital-heirloom.example.txt` 复制而来，并将数据库改为 Neon。

## 标准操作流程

### 1. 环境变量配置（本地开发）

1. 复制环境模板：
   - 从项目根目录复制 `env.digital-heirloom.example.txt` 为 `.env.local`。
2. 更新数据库为 Neon：
   - 将 `.env.local` 中原有的 Supabase `DATABASE_URL` 段落替换为用户提供的 Neon 配置，包括：
     - `DATABASE_URL`
     - `DATABASE_URL_UNPOOLED`（如需要）
     - `PGHOST` / `PGUSER` / `PGDATABASE` / `PGPASSWORD`
     - `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` / `POSTGRES_PRISMA_URL` 等兼容变量
   - 保持 `DATABASE_PROVIDER=postgresql`。
3. 保留 Supabase 相关变量：
   - 不删除 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 等，用于存储、鉴权或其他云功能。

### 2. 数据库迁移（Neon）

当需要为 Digital Heirloom 在 Neon 上初始化或更新表结构时：

1. 确认 `.env.local` 中的 `DATABASE_URL` 指向 Neon。
2. 在项目根目录执行：

   ```bash
   npx tsx scripts/execute-digital-heirloom-migration.ts
   ```

3. 迁移脚本会：
   - 读取 `scripts/migrate-digital-heirloom.sql`。
   - 在 Neon 数据库中创建或更新以下表：
     - `digital_vaults`
     - `beneficiaries`
     - `heartbeat_logs`
     - `dead_man_switch_events`
   - 自动忽略已存在的表或重复约束错误。

### 3. 启动开发服务器

标准步骤：

1. 安装依赖（如尚未安装）：

   ```bash
   pnpm install
   ```

2. 启动本地开发：

   ```bash
   pnpm dev
   ```

3. 默认访问 `http://localhost:3000` 进行 Digital Heirloom 功能测试。

### 4. 日常开发与调试建议

- **文件定位**
  - Digital Heirloom 业务逻辑与 API 路由应优先放在：
    - `src/app/api/digital-heirloom/**`
    - `src/shared/models/**`（模型与类型）
    - `src/shared/services/**`（服务封装）
  - 参考文档：`API_ROUTES_DIGITAL_HEIRLOOM.md`。

- **数据库访问**
  - 始终通过 `db()` 函数访问数据库（位于 `src/core/db/index.ts`），避免在业务代码中直接 `postgres(DATABASE_URL)`。
  - 如需在脚本中访问数据库，复用现有脚本模式（如 `scripts/execute-digital-heirloom-migration.ts`）。

- **错误排查**
  - 如果出现 `DATABASE_URL is not set`：
    - 检查 `.env.local` 是否存在且位于项目根目录。
    - 检查是否正确设置了 `DATABASE_URL`，且未被 shell/部署环境覆盖。
  - 如果连接 Neon 失败：
    - 确认 Neon 实例允许来自当前 IP 的访问。
    - 检查 `sslmode=require` 是否保留。

## 编码风格与安全

- 遵循项目现有的 TypeScript、ESLint、Prettier 规范。
- 禁止在前端代码中直接暴露敏感连接信息：
  - 所有数据库连接相关变量不得带有 `NEXT_PUBLIC_` 前缀。
- 对于脚本与 API 的改动，优先保持向后兼容：
  - 仅在原有逻辑之上扩展 Digital Heirloom 所需能力。

## 当用户提到「不改变 shipany saas 结构框架」时的响应策略

如果用户的需求有以下倾向：

- 大幅重构目录结构；
- 改写核心路由与布局；
- 替换全局状态管理、认证、支付等通用框架；

则应该：

1. 首先提醒该操作可能违反「不改变 ShipAny SaaS 结构框架」这一铁律。
2. 提出一个 **最小变更方案**，只在局部扩展 Digital Heirloom 功能，或者通过配置/环境变量来实现需求。
3. 只有在用户再次明确确认要突破这一约束时，才考虑更大范围修改，并在说明中显式标注风险。






