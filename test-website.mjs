/**
 * 简单的网站可用性测试
 * 测试主要页面是否可以访问
 */

const BASE_URL = 'http://localhost:3000';

const pages = [
  '/en',
  '/en/sign-up',
  '/en/sign-in',
  '/en/niche-loyalty/pricing',
  '/en/niche-loyalty/dashboard',
  '/test-discount.html',
];

async function testPage(url) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const statusText = response.statusText;
    
    if (status === 200) {
      console.log(`✅ ${url} - ${status} ${statusText}`);
      return true;
    } else {
      console.log(`⚠️  ${url} - ${status} ${statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${url} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 网站可用性测试');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const page of pages) {
    const url = `${BASE_URL}${page}`;
    const result = await testPage(url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n========================================');
  console.log(`测试结果: ${passed} 通过, ${failed} 失败`);
  console.log('========================================\n');
  
  if (failed === 0) {
    console.log('✅ 所有页面都可以正常访问！');
  } else {
    console.log('⚠️  部分页面无法访问，请检查服务器状态');
  }
}

// 等待服务器启动
console.log('等待服务器启动...');
setTimeout(() => {
  runTests();
}, 5000);





