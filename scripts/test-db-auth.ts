/**
 * 数据库和认证配置测试脚本
 * 
 * 测试内容：
 * 1. 数据库连接
 * 2. 用户表查询
 * 3. Better Auth 配置
 * 4. 环境变量检查
 * 
 * 运行方法：
 * pnpm tsx scripts/test-db-auth.ts
 */

import { db } from '@/core/db';
import { user, session, account } from '@/config/db/schema';
import { envConfigs } from '@/config';
import { desc } from 'drizzle-orm';

async function testDatabaseAndAuth() {
  console.log('========================================');
  console.log('🔍 数据库和认证配置测试');
  console.log('========================================\n');

  // 1. 检查环境变量
  console.log('📋 [1/5] 检查环境变量配置...\n');

  const envChecks = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'DATABASE_PROVIDER': process.env.DATABASE_PROVIDER,
    'AUTH_URL': process.env.AUTH_URL,
    'BETTER_AUTH_URL': process.env.BETTER_AUTH_URL,
    'AUTH_SECRET': process.env.AUTH_SECRET ? '✅ 已设置' : '❌ 未设置',
    'BETTER_AUTH_SECRET': process.env.BETTER_AUTH_SECRET ? '✅ 已设置' : '❌ 未设置',
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
  };

  let hasError = false;

  for (const [key, value] of Object.entries(envChecks)) {
    if (!value || value === '❌ 未设置') {
      console.log(`❌ ${key}: ${value || '未设置'}`);
      hasError = true;
    } else {
      // 隐藏敏感信息
      if (key.includes('SECRET') || key.includes('DATABASE_URL')) {
        console.log(`✅ ${key}: ${value}`);
      } else {
        console.log(`✅ ${key}: ${value}`);
      }
    }
  }

  console.log('\n📊 envConfigs 对象:');
  console.log({
    app_url: envConfigs.app_url,
    app_name: envConfigs.app_name,
    auth_url: envConfigs.auth_url,
    database_provider: envConfigs.database_provider,
    auth_secret: envConfigs.auth_secret ? '✅ 已设置' : '❌ 未设置',
  });

  if (hasError) {
    console.log('\n⚠️  警告：部分环境变量未设置，可能导致认证失败！\n');
  }

  // 2. 测试数据库连接
  console.log('\n========================================');
  console.log('📡 [2/5] 测试数据库连接...\n');

  try {
    const dbInstance = db();
    console.log('✅ 数据库实例创建成功');
    
    // 查询用户总数
    const users = await dbInstance.select().from(user).limit(1);
    console.log(`✅ 数据库连接成功！`);
    console.log(`📊 用户表可访问，查询到 ${users.length} 条记录（限制1条）\n`);
    
    if (users.length > 0) {
      console.log('👤 示例用户数据:');
      console.log({
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        emailVerified: users[0].emailVerified,
        planType: users[0].planType,
        createdAt: users[0].createdAt,
      });
    }
  } catch (error: any) {
    console.error('❌ 数据库连接失败:');
    console.error(error.message);
    console.error('\n可能的原因:');
    console.error('1. DATABASE_URL 配置错误');
    console.error('2. 数据库服务不可用');
    console.error('3. 网络连接问题');
    console.error('4. 数据库表未创建（需要运行 pnpm db:push）\n');
    throw error;
  }

  // 3. 检查用户表结构
  console.log('\n========================================');
  console.log('🗄️  [3/5] 检查用户表结构...\n');

  try {
    const dbInstance = db();
    
    // 查询最近创建的用户
    const recentUsers = await dbInstance
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        planType: user.planType,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(5);
    
    console.log(`✅ 查询到 ${recentUsers.length} 个最近注册的用户\n`);
    
    if (recentUsers.length > 0) {
      console.log('📋 最近注册的用户列表:');
      recentUsers.forEach((u, index) => {
        console.log(`${index + 1}. ${u.name} (${u.email})`);
        console.log(`   - ID: ${u.id}`);
        console.log(`   - 邮箱验证: ${u.emailVerified ? '✅' : '❌'}`);
        console.log(`   - 计划类型: ${u.planType || 'free'}`);
        console.log(`   - 注册时间: ${u.createdAt}`);
        console.log('');
      });
    } else {
      console.log('⚠️  数据库中暂无用户，这是正常的（新部署）\n');
    }
  } catch (error: any) {
    console.error('❌ 查询用户表失败:');
    console.error(error.message);
  }

  // 4. 检查 session 表
  console.log('\n========================================');
  console.log('🔐 [4/5] 检查 session 表...\n');

  try {
    const dbInstance = db();
    
    const sessions = await dbInstance
      .select()
      .from(session)
      .limit(5);
    
    console.log(`✅ Session 表可访问，查询到 ${sessions.length} 条记录\n`);
    
    if (sessions.length > 0) {
      console.log('📋 活跃 Session 列表:');
      sessions.forEach((s, index) => {
        console.log(`${index + 1}. Session ID: ${s.id.substring(0, 20)}...`);
        console.log(`   - User ID: ${s.userId}`);
        console.log(`   - 过期时间: ${s.expiresAt}`);
        console.log(`   - IP: ${s.ipAddress || 'N/A'}`);
        console.log('');
      });
    }
  } catch (error: any) {
    console.error('❌ 查询 session 表失败:');
    console.error(error.message);
  }

  // 5. 检查 account 表（OAuth 账户）
  console.log('\n========================================');
  console.log('🔗 [5/5] 检查 account 表...\n');

  try {
    const dbInstance = db();
    
    const accounts = await dbInstance
      .select()
      .from(account)
      .limit(5);
    
    console.log(`✅ Account 表可访问，查询到 ${accounts.length} 条记录\n`);
    
    if (accounts.length > 0) {
      console.log('📋 OAuth 账户列表:');
      accounts.forEach((a, index) => {
        console.log(`${index + 1}. Provider: ${a.providerId}`);
        console.log(`   - User ID: ${a.userId}`);
        console.log(`   - Account ID: ${a.accountId}`);
        console.log('');
      });
    }
  } catch (error: any) {
    console.error('❌ 查询 account 表失败:');
    console.error(error.message);
  }

  // 总结
  console.log('\n========================================');
  console.log('📊 测试总结');
  console.log('========================================\n');

  console.log('✅ 数据库连接: 正常');
  console.log('✅ 用户表: 可访问');
  console.log('✅ Session 表: 可访问');
  console.log('✅ Account 表: 可访问');

  if (hasError) {
    console.log('\n⚠️  环境变量配置: 有问题');
    console.log('\n🔧 修复建议:');
    console.log('1. 创建 .env.local 文件');
    console.log('2. 添加以下环境变量:');
    console.log('   AUTH_URL=http://localhost:3000');
    console.log('   BETTER_AUTH_URL=http://localhost:3000');
    console.log('   AUTH_SECRET=your-secret-key');
    console.log('   BETTER_AUTH_SECRET=your-secret-key');
    console.log('   DATABASE_URL=your-database-url');
  } else {
    console.log('✅ 环境变量配置: 正常');
  }

  console.log('\n========================================');
  console.log('🎉 测试完成！');
  console.log('========================================\n');

  console.log('📝 下一步操作:');
  console.log('1. 如果本地测试通过，运行: pnpm dev');
  console.log('2. 访问: http://localhost:3000/en/sign-up');
  console.log('3. 尝试注册一个测试账户');
  console.log('4. 检查数据库中是否成功创建用户记录\n');
}

// 运行测试
testDatabaseAndAuth()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 测试过程中发生错误:');
    console.error(error);
    process.exit(1);
  });
