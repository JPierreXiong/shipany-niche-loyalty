/**
 * Upstash QStash Setup Script
 * 自动配置QStash定时任务
 */

const QSTASH_URL = process.env.QSTASH_URL || 'https://qstash.upstash.io';
const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app';

async function setupQStashSchedule() {
  if (!QSTASH_TOKEN) {
    console.error('❌ QSTASH_TOKEN not found in environment variables');
    process.exit(1);
  }

  console.log('🚀 Setting up QStash schedule...');
  console.log(`📍 Target URL: ${APP_URL}/api/qstash/check-subscriptions`);

  try {
    // 创建每天凌晨2点执行的定时任务
    const response = await fetch(`${QSTASH_URL}/v2/schedules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: `${APP_URL}/api/qstash/check-subscriptions`,
        cron: '0 2 * * *', // 每天凌晨2点 (UTC)
        body: JSON.stringify({
          task: 'check-subscriptions',
          source: 'qstash',
        }),
        retries: 3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`QStash API error: ${error}`);
    }

    const schedule = await response.json();
    console.log('✅ QStash schedule created successfully!');
    console.log('📋 Schedule ID:', schedule.scheduleId);
    console.log('⏰ Cron expression: 0 2 * * * (Daily at 2:00 AM UTC)');
    console.log('🔄 Retries: 3');
    console.log('\n📝 Next steps:');
    console.log('1. Add environment variables to Vercel:');
    console.log('   - QSTASH_URL');
    console.log('   - QSTASH_TOKEN');
    console.log('   - QSTASH_CURRENT_SIGNING_KEY');
    console.log('   - QSTASH_NEXT_SIGNING_KEY');
    console.log('2. Deploy to Vercel');
    console.log('3. QStash will automatically call your endpoint daily');

  } catch (error: any) {
    console.error('❌ Failed to setup QStash schedule:', error.message);
    process.exit(1);
  }
}

// 列出现有的定时任务
async function listSchedules() {
  if (!QSTASH_TOKEN) {
    console.error('❌ QSTASH_TOKEN not found');
    return;
  }

  try {
    const response = await fetch(`${QSTASH_URL}/v2/schedules`, {
      headers: {
        'Authorization': `Bearer ${QSTASH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list schedules: ${response.statusText}`);
    }

    const schedules = await response.json();
    console.log('📋 Existing QStash schedules:');
    console.log(JSON.stringify(schedules, null, 2));

  } catch (error: any) {
    console.error('❌ Failed to list schedules:', error.message);
  }
}

// 删除定时任务
async function deleteSchedule(scheduleId: string) {
  if (!QSTASH_TOKEN) {
    console.error('❌ QSTASH_TOKEN not found');
    return;
  }

  try {
    const response = await fetch(`${QSTASH_URL}/v2/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${QSTASH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete schedule: ${response.statusText}`);
    }

    console.log(`✅ Schedule ${scheduleId} deleted successfully`);

  } catch (error: any) {
    console.error('❌ Failed to delete schedule:', error.message);
  }
}

// 命令行参数处理
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupQStashSchedule();
    break;
  case 'list':
    listSchedules();
    break;
  case 'delete':
    const scheduleId = process.argv[3];
    if (!scheduleId) {
      console.error('❌ Please provide schedule ID: npm run qstash:delete <scheduleId>');
      process.exit(1);
    }
    deleteSchedule(scheduleId);
    break;
  default:
    console.log('Usage:');
    console.log('  npm run qstash:setup  - Create QStash schedule');
    console.log('  npm run qstash:list   - List all schedules');
    console.log('  npm run qstash:delete <id> - Delete a schedule');
    process.exit(1);
}



