/**
 * 简单的环境变量检查脚本
 */

console.log('========================================');
console.log('🔍 环境变量检查');
console.log('========================================\n');

const checks = [
  { name: 'DATABASE_URL', value: process.env.DATABASE_URL, required: true },
  { name: 'AUTH_URL', value: process.env.AUTH_URL, required: true },
  { name: 'BETTER_AUTH_URL', value: process.env.BETTER_AUTH_URL, required: true },
  { name: 'AUTH_SECRET', value: process.env.AUTH_SECRET ? '已设置' : undefined, required: true },
  { name: 'BETTER_AUTH_SECRET', value: process.env.BETTER_AUTH_SECRET ? '已设置' : undefined, required: true },
  { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL, required: true },
];

let hasError = false;

checks.forEach(check => {
  if (!check.value && check.required) {
    console.log(`❌ ${check.name}: 未设置`);
    hasError = true;
  } else {
    console.log(`✅ ${check.name}: ${check.value}`);
  }
});

console.log('\n========================================');
if (hasError) {
  console.log('❌ 配置检查失败！');
  console.log('\n请创建 .env.local 文件并添加以下内容：\n');
  console.log('DATABASE_URL=postgresql://neondb_owner:npg_cjqDLCsv1Q0r@ep-dawn-block-ahqazngy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require');
  console.log('DATABASE_PROVIDER=postgresql');
  console.log('AUTH_URL=http://localhost:3000');
  console.log('BETTER_AUTH_URL=http://localhost:3000');
  console.log('AUTH_SECRET=niche-loyalty-secret-key-local-dev');
  console.log('BETTER_AUTH_SECRET=niche-loyalty-secret-key-local-dev');
  console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
  console.log('NEXT_PUBLIC_APP_NAME=Glow');
  process.exit(1);
} else {
  console.log('✅ 配置检查通过！');
  console.log('\n可以运行: pnpm dev');
}
console.log('========================================\n');
