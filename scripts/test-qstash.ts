/**
 * 测试 Upstash QStash 集成
 * 
 * 使用方法：
 * 1. 确保已安装依赖：pnpm add @upstash/qstash
 * 2. 配置环境变量：QSTASH_TOKEN
 * 3. 运行：npx tsx scripts/test-qstash.ts
 */

import { Client } from '@upstash/qstash';

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const TARGET_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/cron/qstash-sync`
  : 'http://localhost:3000/api/cron/qstash-sync';

async function testQStash() {
  if (!QSTASH_TOKEN) {
    console.error('❌ 错误: 未找到 QSTASH_TOKEN 环境变量');
    console.log('请在 .env.local 中添加：');
    console.log('QSTASH_TOKEN=your_token_here');
    process.exit(1);
  }

  console.log('🚀 开始测试 Upstash QStash 集成...\n');
  console.log(`📍 目标 URL: ${TARGET_URL}\n`);

  try {
    const client = new Client({ token: QSTASH_TOKEN });

    // 发送测试请求
    console.log('📤 发送测试请求...');
    const result = await client.publishJSON({
      url: TARGET_URL,
      body: {
        source: 'test-script',
        timestamp: new Date().toISOString(),
      },
    });

    console.log('✅ 请求发送成功！');
    console.log('📊 响应信息：');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n💡 提示：');
    console.log('1. 检查 Vercel 函数日志确认请求已到达');
    console.log('2. 在 Upstash Console 查看请求详情');
    console.log('3. 如果是本地测试，确保服务器正在运行');

  } catch (error: any) {
    console.error('❌ 测试失败：', error.message);
    console.log('\n🔍 故障排查：');
    console.log('1. 确认 QSTASH_TOKEN 正确');
    console.log('2. 确认目标 URL 可访问');
    console.log('3. 检查网络连接');
    process.exit(1);
  }
}

testQStash();


