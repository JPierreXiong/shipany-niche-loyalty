import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    // Plan management fields
    planType: text('plan_type').default('free'), // free, base, pro, on_demand
    freeTrialUsed: integer('free_trial_used').default(0), // Free trial count used
    lastCheckinDate: text('last_checkin_date'), // Last check-in date (YYYY-MM-DD)
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Search users by name in admin dashboard
    index('idx_user_name').on(table.name),
    // Order users by registration time for latest users list
    index('idx_user_created_at').on(table.createdAt),
  ]
);

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    // Composite: Query user sessions and filter by expiration
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_session_user_expires').on(table.userId, table.expiresAt),
  ]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Query all linked accounts for a user
    index('idx_account_user_id').on(table.userId),
    // Composite: OAuth login (most critical)
    // Can also be used for: WHERE providerId = ? (left-prefix)
    index('idx_account_provider_account').on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Find verification code by identifier (e.g., find code by email)
    index('idx_verification_identifier').on(table.identifier),
  ]
);

export const config = pgTable('config', {
  name: text('name').unique().notNull(),
  value: text('value'),
});

export const taxonomy = pgTable(
  'taxonomy',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    image: text('image'),
    icon: text('icon'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query taxonomies by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_taxonomy_type_status').on(table.type, table.status),
  ]
);

export const post = pgTable(
  'post',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    slug: text('slug').unique().notNull(),
    type: text('type').notNull(),
    title: text('title'),
    description: text('description'),
    image: text('image'),
    content: text('content'),
    categories: text('categories'),
    tags: text('tags'),
    authorName: text('author_name'),
    authorImage: text('author_image'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Composite: Query posts by type and status
    // Can also be used for: WHERE type = ? (left-prefix)
    index('idx_post_type_status').on(table.type, table.status),
  ]
);

export const order = pgTable(
  'order',
  {
    id: text('id').primaryKey(),
    orderNo: text('order_no').unique().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // checkout user email
    status: text('status').notNull(), // created, paid, failed
    amount: integer('amount').notNull(), // checkout amount in cents
    currency: text('currency').notNull(), // checkout currency
    productId: text('product_id'),
    paymentType: text('payment_type'), // one_time, subscription
    paymentInterval: text('payment_interval'), // day, week, month, year
    paymentProvider: text('payment_provider').notNull(),
    paymentSessionId: text('payment_session_id'),
    checkoutInfo: text('checkout_info').notNull(), // checkout request info
    checkoutResult: text('checkout_result'), // checkout result
    paymentResult: text('payment_result'), // payment result
    discountCode: text('discount_code'), // discount code
    discountAmount: integer('discount_amount'), // discount amount in cents
    discountCurrency: text('discount_currency'), // discount currency
    paymentEmail: text('payment_email'), // actual payment email
    paymentAmount: integer('payment_amount'), // actual payment amount
    paymentCurrency: text('payment_currency'), // actual payment currency
    paidAt: timestamp('paid_at'), // paid at
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    description: text('description'), // order description
    productName: text('product_name'), // product name
    subscriptionId: text('subscription_id'), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    checkoutUrl: text('checkout_url'), // checkout url
    callbackUrl: text('callback_url'), // callback url, after handle callback
    creditsAmount: integer('credits_amount'), // credits amount
    creditsValidDays: integer('credits_valid_days'), // credits validity days
    planName: text('plan_name'), // subscription plan name
    paymentProductId: text('payment_product_id'), // payment product id
    invoiceId: text('invoice_id'),
    invoiceUrl: text('invoice_url'),
    subscriptionNo: text('subscription_no'), // order subscription no
    transactionId: text('transaction_id'), // payment transaction id
    paymentUserName: text('payment_user_name'), // payment user name
    paymentUserId: text('payment_user_id'), // payment user id
  },
  (table) => [
    // Composite: Query user orders by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_order_user_status_payment_type').on(
      table.userId,
      table.status,
      table.paymentType
    ),
    // Composite: Prevent duplicate payments
    // Can also be used for: WHERE transactionId = ? (left-prefix)
    index('idx_order_transaction_provider').on(
      table.transactionId,
      table.paymentProvider
    ),
    // Order orders by creation time for listing
    index('idx_order_created_at').on(table.createdAt),
  ]
);

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey(),
    subscriptionNo: text('subscription_no').unique().notNull(), // subscription no
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userEmail: text('user_email'), // subscription user email
    status: text('status').notNull(), // subscription status
    paymentProvider: text('payment_provider').notNull(),
    subscriptionId: text('subscription_id').notNull(), // provider subscription id
    subscriptionResult: text('subscription_result'), // provider subscription result
    productId: text('product_id'), // product id
    description: text('description'), // subscription description
    amount: integer('amount'), // subscription amount
    currency: text('currency'), // subscription currency
    interval: text('interval'), // subscription interval, day, week, month, year
    intervalCount: integer('interval_count'), // subscription interval count
    trialPeriodDays: integer('trial_period_days'), // subscription trial period days
    currentPeriodStart: timestamp('current_period_start'), // subscription current period start
    currentPeriodEnd: timestamp('current_period_end'), // subscription current period end
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    planName: text('plan_name'),
    planType: text('plan_type'), // free, base, pro, on_demand
    billingUrl: text('billing_url'),
    productName: text('product_name'), // subscription product name
    creditsAmount: integer('credits_amount'), // subscription credits amount
    creditsValidDays: integer('credits_valid_days'), // subscription credits valid days
    // Plan limits
    maxVideoDuration: integer('max_video_duration'), // Video duration limit in seconds (null = unlimited)
    concurrentLimit: integer('concurrent_limit').default(1), // Concurrent task limit (null = unlimited)
    exportFormats: text('export_formats'), // JSON array: ["SRT","CSV","VTT","TXT"]
    storageHours: integer('storage_hours').default(24), // Storage duration in hours
    translationCharLimit: integer('translation_char_limit'), // Translation character limit (null = unlimited)
    paymentProductId: text('payment_product_id'), // subscription payment product id
    paymentUserId: text('payment_user_id'), // subscription payment user id
    canceledAt: timestamp('canceled_at'), // subscription canceled apply at
    canceledEndAt: timestamp('canceled_end_at'), // subscription canceled end at
    canceledReason: text('canceled_reason'), // subscription canceled reason
    canceledReasonType: text('canceled_reason_type'), // subscription canceled reason type
  },
  (table) => [
    // Composite: Query user's subscriptions by status (most common)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_subscription_user_status_interval').on(
      table.userId,
      table.status,
      table.interval
    ),
    // Composite: Prevent duplicate subscriptions
    // Can also be used for: WHERE paymentProvider = ? (left-prefix)
    index('idx_subscription_provider_id').on(
      table.subscriptionId,
      table.paymentProvider
    ),
    // Order subscriptions by creation time for listing
    index('idx_subscription_created_at').on(table.createdAt),
  ]
);

export const credit = pgTable(
  'credit',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // user id
    userEmail: text('user_email'), // user email
    orderNo: text('order_no'), // payment order no
    subscriptionNo: text('subscription_no'), // subscription no
    transactionNo: text('transaction_no').unique().notNull(), // transaction no
    transactionType: text('transaction_type').notNull(), // transaction type, grant / consume
    transactionScene: text('transaction_scene'), // transaction scene, payment / subscription / gift / award
    credits: integer('credits').notNull(), // credits amount, n or -n
    remainingCredits: integer('remaining_credits').notNull().default(0), // remaining credits amount
    description: text('description'), // transaction description
    expiresAt: timestamp('expires_at'), // transaction expires at
    status: text('status').notNull(), // transaction status
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    consumedDetail: text('consumed_detail'), // consumed detail
    metadata: text('metadata'), // transaction metadata
  },
  (table) => [
    // Critical composite index for credit consumption (FIFO queue)
    // Query: WHERE userId = ? AND transactionType = 'grant' AND status = 'active'
    //        AND remainingCredits > 0 ORDER BY expiresAt
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_credit_consume_fifo').on(
      table.userId,
      table.status,
      table.transactionType,
      table.remainingCredits,
      table.expiresAt
    ),
    // Query credits by order number
    index('idx_credit_order_no').on(table.orderNo),
    // Query credits by subscription number
    index('idx_credit_subscription_no').on(table.subscriptionNo),
  ]
);

export const apikey = pgTable(
  'apikey',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    title: text('title').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query user's API keys by status
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_apikey_user_status').on(table.userId, table.status),
    // Composite: Validate active API key (most common for auth)
    // Can also be used for: WHERE key = ? (left-prefix)
    index('idx_apikey_key_status').on(table.key, table.status),
  ]
);

// RBAC Tables
export const role = pgTable(
  'role',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(), // admin, editor, viewer
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    sort: integer('sort').default(0).notNull(),
  },
  (table) => [
    // Query active roles
    index('idx_role_status').on(table.status),
  ]
);

export const permission = pgTable(
  'permission',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(), // admin.users.read, admin.posts.write
    resource: text('resource').notNull(), // users, posts, categories
    action: text('action').notNull(), // read, write, delete
    title: text('title').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Composite: Query permissions by resource and action
    // Can also be used for: WHERE resource = ? (left-prefix)
    index('idx_permission_resource_action').on(table.resource, table.action),
  ]
);

export const rolePermission = pgTable(
  'role_permission',
  {
    id: text('id').primaryKey(),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    // Composite: Query permissions for a role
    // Can also be used for: WHERE roleId = ? (left-prefix)
    index('idx_role_permission_role_permission').on(
      table.roleId,
      table.permissionId
    ),
  ]
);

export const userRole = pgTable(
  'user_role',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    expiresAt: timestamp('expires_at'),
  },
  (table) => [
    // Composite: Query user's active roles (most critical for auth)
    // Can also be used for: WHERE userId = ? (left-prefix)
    index('idx_user_role_user_expires').on(table.userId, table.expiresAt),
  ]
);

// ============================================
// Niche Loyalty - Shopify 会员与活动表
// ============================================

// 卖家店铺表：将 ShipAny 用户与 Shopify 店铺绑定
export const loyaltyStore = pgTable(
  'loyalty_store',
  {
    id: text('id').primaryKey(), // 使用全局 UUID
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }), // ShipAny user id
    name: text('name'), // 自定义店铺名称（可选）
    shopifyDomain: text('shopify_domain').notNull(), // 例如 myshop.myshopify.com
    shopifyClientId: text('shopify_client_id'), // Shopify App Client ID
    shopifyClientSecret: text('shopify_client_secret'), // Shopify App Client Secret（加密存储）
    shopifyAccessToken: text('shopify_access_token').notNull(), // Admin API access token（仅服务端使用）
    shopifyWebhookSecret: text('shopify_webhook_secret').notNull(), // Webhook 校验用密钥
    encryptionKey: text('encryption_key'), // Token 加密密钥
    connectionType: text('connection_type').default('custom_app'), // custom_app / oauth
    scopes: text('scopes'), // 已授权的权限（逗号分隔）
    webhookRegistered: boolean('webhook_registered').default(false), // Webhook 是否已注册
    status: text('status').default('active').notNull(), // active / paused / disconnected
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 一个用户可以连接多个店铺，但同一 shopifyDomain 仅允许一条记录
    index('idx_loyalty_store_user').on(table.userId),
    index('idx_loyalty_store_domain').on(table.shopifyDomain),
  ]
);

// Webhook 注册表：追踪 Shopify Webhook 注册状态
export const loyaltyWebhook = pgTable(
  'loyalty_webhook',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    topic: text('topic').notNull(), // orders/paid, customers/create, orders/updated
    webhookId: text('webhook_id'), // Shopify Webhook ID
    status: text('status').default('active'), // active / inactive
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_loyalty_webhook_store_id').on(table.storeId),
    index('idx_loyalty_webhook_topic').on(table.topic),
  ]
);

// 会员表：按店铺维度管理会员（Email 即会员身份）
export const loyaltyMember = pgTable(
  'loyalty_member',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    name: text('name'),
    discountCode: text('discount_code'), // 唯一折扣码（用于 Apple Wallet）
    passUrl: text('pass_url'), // Apple Wallet .pkpass 文件 URL（存储在 Vercel Blob）
    // 会员来源：import / shopify_sync / qr
    source: text('source').default('import').notNull(),
    status: text('status').default('active').notNull(), // active / blocked
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    lastActiveAt: timestamp('last_active_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // 保证同一店铺下 Email 唯一
    index('idx_loyalty_member_store').on(table.storeId),
    index('idx_loyalty_member_store_email').on(table.storeId, table.email),
    index('idx_loyalty_member_discount_code').on(table.discountCode),
  ]
);

// 活动表：一次营销活动（一个主题+一批折扣）
export const loyaltyCampaign = pgTable(
  'loyalty_campaign',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // 活动名称，如 "Welcome back 20% OFF"
    subject: text('subject'), // 邮件标题
    // 折扣类型：percentage / fixed_amount
    discountType: text('discount_type').default('percentage').notNull(),
    discountValue: integer('discount_value').notNull(), // 20 代表 20%
    status: text('status').default('draft').notNull(), // draft / scheduled / sending / sent / archived
    scheduledAt: timestamp('scheduled_at'),
    sentAt: timestamp('sent_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_campaign_store').on(table.storeId),
    index('idx_loyalty_campaign_status').on(table.status),
  ]
);

// 折扣码表：每个会员一条唯一折扣码，支持自动核销追踪
export const loyaltyDiscountCode = pgTable(
  'loyalty_discount_code',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => loyaltyCampaign.id, { onDelete: 'cascade' }),
    memberId: text('member_id')
      .notNull()
      .references(() => loyaltyMember.id, { onDelete: 'cascade' }),
    code: text('code').notNull().unique(), // Shopify 一次性折扣码
    isRedeemed: boolean('is_redeemed').default(false).notNull(),
    orderId: text('order_id'), // Shopify 订单 ID
    orderName: text('order_name'), // Shopify 订单号（如 #1001）
    redeemedAt: timestamp('redeemed_at'),
    sentAt: timestamp('sent_at'), // 邮件发送时间
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_discount_member').on(table.memberId),
    index('idx_loyalty_discount_campaign').on(table.campaignId),
    index('idx_loyalty_discount_redeemed').on(table.isRedeemed),
  ]
);

// 优惠卡配置表：定义可复用的优惠卡模板
export const loyaltyDiscountCard = pgTable(
  'loyalty_discount_card',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    discountType: text('discount_type').default('percentage').notNull(),
    discountValue: integer('discount_value').notNull(),
    expireDays: integer('expire_days').default(30).notNull(),
    status: text('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_card_store').on(table.storeId),
    index('idx_loyalty_card_status').on(table.status),
  ]
);

// 自动化规则表：定义触发条件和动作
export const loyaltyAutomation = pgTable(
  'loyalty_automation',
  {
    id: text('id').primaryKey(),
    cardId: text('card_id')
      .notNull()
      .references(() => loyaltyDiscountCard.id, { onDelete: 'cascade' }),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    triggerType: text('trigger_type').notNull(),
    triggerValue: integer('trigger_value'),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_automation_store').on(table.storeId),
    index('idx_loyalty_automation_active').on(table.isActive),
    index('idx_loyalty_automation_trigger').on(table.triggerType),
  ]
);

// 发送任务队列表：异步邮件发送队列
export const loyaltySendTask = pgTable(
  'loyalty_send_task',
  {
    id: text('id').primaryKey(),
    automationId: text('automation_id')
      .references(() => loyaltyAutomation.id, { onDelete: 'set null' }),
    customerId: text('customer_id')
      .notNull()
      .references(() => loyaltyMember.id, { onDelete: 'cascade' }),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    status: text('status').default('pending').notNull(),
    scheduledAt: timestamp('scheduled_at').defaultNow().notNull(),
    sentAt: timestamp('sent_at'),
    errorMessage: text('error_message'),
    retryCount: integer('retry_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_task_status').on(table.status),
    index('idx_loyalty_task_scheduled').on(table.scheduledAt),
    index('idx_loyalty_task_customer').on(table.customerId),
  ]
);

// 发送日志表：追踪邮件打开、点击等行为
export const loyaltySendLog = pgTable(
  'loyalty_send_log',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id')
      .notNull()
      .references(() => loyaltySendTask.id, { onDelete: 'cascade' }),
    customerId: text('customer_id')
      .notNull()
      .references(() => loyaltyMember.id, { onDelete: 'cascade' }),
    emailProvider: text('email_provider').default('resend').notNull(),
    opened: boolean('opened').default(false).notNull(),
    openedAt: timestamp('opened_at'),
    clicked: boolean('clicked').default(false).notNull(),
    clickedAt: timestamp('clicked_at'),
    bounced: boolean('bounced').default(false).notNull(),
    bouncedAt: timestamp('bounced_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_log_task').on(table.taskId),
    index('idx_loyalty_log_customer').on(table.customerId),
  ]
);

// 核销日志表：追踪折扣码使用情况（不存储订单详情，保护隐私）
export const loyaltyRedeemLog = pgTable(
  'loyalty_redeem_log',
  {
    id: text('id').primaryKey(),
    discountCodeId: text('discount_code_id')
      .notNull()
      .references(() => loyaltyDiscountCode.id, { onDelete: 'cascade' }),
    storeId: text('store_id')
      .notNull()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    shopifyOrderId: text('shopify_order_id').notNull(),
    orderAmount: integer('order_amount'),
    redeemedAt: timestamp('redeemed_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_loyalty_redeem_store').on(table.storeId),
    index('idx_loyalty_redeem_code').on(table.discountCodeId),
    index('idx_loyalty_redeem_date').on(table.redeemedAt),
  ]
);

// 品牌配置表：存储品牌素材和发件人信息（合规必填）
export const loyaltyBrandConfig = pgTable(
  'loyalty_brand_config',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .unique()
      .references(() => loyaltyStore.id, { onDelete: 'cascade' }),
    brandName: text('brand_name'),
    logoUrl: text('logo_url'),
    primaryColor: text('primary_color').default('#000000').notNull(),
    senderName: text('sender_name').notNull(),
    senderEmail: text('sender_email').notNull(),
    replyToEmail: text('reply_to_email'),
    unsubscribeUrl: text('unsubscribe_url'),
    customDomain: text('custom_domain'),
    domainVerified: boolean('domain_verified').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('idx_loyalty_brand_store').on(table.storeId),
  ]
);

// ============================================
// ⚠️ 已删除 - Digital Heirloom 项目不需要
// 以下表定义已删除：
// - aiTask (AI 任务表)
// - chat (AI 聊天表)
// - chatMessage (AI 聊天消息表)
// - mediaTasks (媒体任务表)
// 删除日期: 2025-01-15
// 原因: 项目转向 Digital Heirloom，不再需要这些功能
// ============================================

export const dailyCheckins = pgTable(
  'daily_checkins',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    checkinDate: text('checkin_date').notNull(), // Format: YYYY-MM-DD (UTC)
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // Unique index: Prevent duplicate check-ins for same user on same date
    // This provides physical isolation at database level
    index('idx_daily_checkin_user_date').on(table.userId, table.checkinDate),
  ]
);

// ============================================
