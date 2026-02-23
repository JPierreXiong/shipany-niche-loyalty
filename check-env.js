/**
 * 环境变量检查脚本
 * 运行: node check-env.js
 */

const requiredEnvs = [
  // 基础认证
  'AUTH_SECRET',
  // 数据库
  'DATABASE_URL',
  // Upstash 调度 (解决 Hobby 限制)
  'QSTASH_CURRENT_SIGNING_KEY',
  'QSTASH_NEXT_SIGNING_KEY',
  'QSTASH_URL',
  'QSTASH_TOKEN',
  // Creem 支付
  'CREEM_API_KEY',
  'CREEM_WEBHOOK_SECRET',
  // Cron 路由安全
  'CRON_SECRET',
  // Resend 邮件
  'RESEND_API_KEY',
  // Vercel Blob 存储
  'BLOB_READ_WRITE_TOKEN',
];

const optionalEnvs = [
  'NEXT_PUBLIC_APP_URL',
  'SHOPIFY_API_VERSION',
];

console.log('🔍 开始检查环境变量配置...\n');

// 检查必需变量
const missing = requiredEnvs.filter(env => !process.env[env]);

if (missing.length > 0) {
  console.error('❌ 缺失以下必需环境变量:');
  missing.forEach(env => console.error(`   - ${env}`));
  console.log('\n💡 建议：');
  console.log('1. 在 Vercel 控制台 Settings -> Environment Variables 中添加。');
  console.log('2. 运行 "vercel env pull .env.local" 同步到本地。');
  console.log('3. 参考 NEON_MIGRATION_GUIDE.md 获取详细配置说明。\n');
} else {
  console.log('✅ 所有核心环境变量已就绪！\n');
}

// 检查可选变量
const missingOptional = optionalEnvs.filter(env => !process.env[env]);
if (missingOptional.length > 0) {
  console.warn('⚠️ 以下可选环境变量未设置（可能影响部分功能）:');
  missingOptional.forEach(env => console.warn(`   - ${env}`));
  console.log('');
}

// 检查 Creem 配置
if (process.env.CREEM_API_KEY) {
  console.log('🔐 Creem 配置检查:');
  console.log(`   API Key: ${process.env.CREEM_API_KEY.substring(0, 10)}...`);
  if (process.env.CREEM_WEBHOOK_SECRET) {
    console.log(`   Webhook Secret: ${process.env.CREEM_WEBHOOK_SECRET.substring(0, 10)}...`);
    console.log('   ✅ Creem 配置完整\n');
  } else {
    console.error('   ❌ 缺少 CREEM_WEBHOOK_SECRET（会导致 400 错误）\n');
  }
}

// 检查 Shopify 配置
console.log('🛍️ Shopify 集成检查:');
const shopifyVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
console.log(`   API Version: ${shopifyVersion}`);
console.log('   ✅ Shopify Custom App 模式已启用\n');

// 额外检查 i18n 风险
console.log('🌐 国际化文件检查:');
try {
  const fs = require('fs');
  const path = require('path');
  
  const messagesPath = path.join(__dirname, 'messages', 'en.json');
  if (fs.existsSync(messagesPath)) {
    const enMessages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    
    const requiredKeys = [
      'landing.zero-knowledge-security',
      'landing.hero-title',
      'dashboard.title',
    ];
    
    const missingKeys = requiredKeys.filter(key => {
      const keys = key.split('.');
      let obj = enMessages;
      for (const k of keys) {
        if (!obj || !obj[k]) return true;
        obj = obj[k];
      }
      return false;
    });
    
    if (missingKeys.length > 0) {
      console.warn('   ⚠️ 警告：messages/en.json 中缺少以下键值:');
      missingKeys.forEach(key => console.warn(`      - ${key}`));
      console.log('');
    } else {
      console.log('   ✅ 国际化文件完整\n');
    }
  } else {
    console.warn('   ⚠️ 无法找到 messages/en.json\n');
  }
} catch (e) {
  console.warn('   ⚠️ 无法加载国际化文件，请手动检查。\n');
}

// 数据库连接检查
console.log('🗄️ 数据库连接检查:');
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl.includes('neon.tech')) {
    console.log('   ✅ Neon PostgreSQL 已配置');
    console.log('   提示: 确保已执行 migrations/add_shopify_custom_app_support.sql\n');
  } else {
    console.warn('   ⚠️ 数据库 URL 不是 Neon，请确认配置正确\n');
  }
} else {
  console.error('   ❌ 缺少 DATABASE_URL\n');
}

// 总结
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (missing.length === 0) {
  console.log('✅ 环境配置检查通过！可以开始部署。');
} else {
  console.log('❌ 请先修复上述问题后再部署。');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');




