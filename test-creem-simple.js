/**
 * Simple Creem Payment Test Script
 * 可以在 Node.js 中运行的简化测试脚本
 * 
 * 使用方法:
 * 1. 设置环境变量或直接修改下面的配置
 * 2. 运行: node test-creem-simple.js
 */

// ============================================
// 配置区域 - 请填写你的 Creem 凭证
// ============================================
const CONFIG = {
  apiKey: process.env.CREEM_API_KEY || 'YOUR_CREEM_API_KEY_HERE',
  environment: process.env.CREEM_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
  
  // 产品 ID - 从 Creem Dashboard 获取
  productIds: {
    glow_seed: process.env.CREEM_PRODUCT_ID_SEED || '',
    glow_base: process.env.CREEM_PRODUCT_ID_BASE || '',
    glow_pro: process.env.CREEM_PRODUCT_ID_PRO || '',
  }
};

// ============================================
// 测试函数
// ============================================

async function testCreemPayment() {
  console.log('🔍 Creem Payment Diagnostic Test\n');
  console.log('='.repeat(70));
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: 检查配置
  console.log('\n📋 Test 1: Configuration Check');
  console.log('-'.repeat(70));
  
  if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_CREEM_API_KEY_HERE') {
    console.log('❌ FAIL: API Key not configured');
    console.log('   Please set CREEM_API_KEY in environment or update CONFIG.apiKey');
    results.failed++;
  } else {
    console.log('✅ PASS: API Key configured');
    console.log(`   Key: ${CONFIG.apiKey.substring(0, 15)}...`);
    results.passed++;
  }
  results.total++;

  const baseUrl = CONFIG.environment === 'production'
    ? 'https://api.creem.io'
    : 'https://test-api.creem.io';
  
  console.log(`   Environment: ${CONFIG.environment}`);
  console.log(`   API URL: ${baseUrl}`);

  // 检查产品 ID
  console.log('\n   Product IDs:');
  let hasProductId = false;
  for (const [key, value] of Object.entries(CONFIG.productIds)) {
    if (value) {
      console.log(`   ✅ ${key}: ${value}`);
      hasProductId = true;
    } else {
      console.log(`   ❌ ${key}: Not configured`);
    }
  }

  if (!hasProductId) {
    console.log('\n⚠️  WARNING: No product IDs configured');
    console.log('   Some tests will be skipped');
  }

  // Test 2: API 连接测试
  console.log('\n🌐 Test 2: API Connection Test');
  console.log('-'.repeat(70));
  
  if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_CREEM_API_KEY_HERE') {
    console.log('⚠️  SKIP: API Key not configured');
    results.total++;
  } else {
    try {
      const testUrl = `${baseUrl}/v1/checkouts?checkout_id=test_connection`;
      console.log(`   Testing: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'x-api-key': CONFIG.apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log(`   Response Status: ${response.status}`);

      if (response.status === 401) {
        console.log('❌ FAIL: Invalid API Key (401 Unauthorized)');
        const errorData = await response.json();
        console.log('   Error:', JSON.stringify(errorData, null, 2));
        results.failed++;
      } else if (response.status === 404 || response.status === 200) {
        console.log('✅ PASS: API connection successful');
        console.log('   API Key is valid and server is reachable');
        results.passed++;
      } else {
        console.log(`⚠️  WARNING: Unexpected status ${response.status}`);
        const errorData = await response.json();
        console.log('   Response:', JSON.stringify(errorData, null, 2));
        results.failed++;
      }
      results.total++;
    } catch (error) {
      console.log('❌ FAIL: Connection error');
      console.log('   Error:', error.message);
      results.failed++;
      results.total++;
    }
  }

  // Test 3: 创建 Checkout 测试
  console.log('\n💳 Test 3: Create Checkout Session');
  console.log('-'.repeat(70));

  // 找到第一个配置的产品 ID
  let testProductId = '';
  let testProductName = '';
  for (const [key, value] of Object.entries(CONFIG.productIds)) {
    if (value) {
      testProductId = value;
      testProductName = key;
      break;
    }
  }

  if (!testProductId) {
    console.log('⚠️  SKIP: No product ID configured for testing');
    results.total++;
  } else if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_CREEM_API_KEY_HERE') {
    console.log('⚠️  SKIP: API Key not configured');
    results.total++;
  } else {
    try {
      console.log(`   Testing with: ${testProductName}`);
      console.log(`   Product ID: ${testProductId}`);

      const payload = {
        product_id: testProductId,
        units: 1,
        customer: {
          email: 'test@example.com',
          name: 'Test User',
        },
        success_url: 'https://example.com/success',
        metadata: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('   Creating checkout session...');

      const response = await fetch(`${baseUrl}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'x-api-key': CONFIG.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(`   Response Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ PASS: Checkout session created successfully');
        console.log(`   Session ID: ${data.id}`);
        console.log(`   Checkout URL: ${data.checkout_url}`);
        results.passed++;
      } else {
        const errorData = await response.json();
        console.log('❌ FAIL: Failed to create checkout session');
        console.log(`   Status: ${response.status}`);
        console.log('   Error:', JSON.stringify(errorData, null, 2));
        
        // 诊断错误
        if (response.status === 400) {
          console.log('\n   🔍 Diagnosis:');
          console.log('   - Product ID may be invalid or not found');
          console.log('   - Product may be archived or inactive in Creem Dashboard');
          console.log('   - Check: https://www.creem.io/dashboard/products');
        } else if (response.status === 401) {
          console.log('\n   🔍 Diagnosis:');
          console.log('   - API Key is invalid or expired');
          console.log('   - Check: https://www.creem.io/dashboard/settings/api');
        }
        
        results.failed++;
      }
      results.total++;
    } catch (error) {
      console.log('❌ FAIL: Request error');
      console.log('   Error:', error.message);
      results.failed++;
      results.total++;
    }
  }

  // Test 4: 验证所有产品 ID
  console.log('\n🔍 Test 4: Validate All Product IDs');
  console.log('-'.repeat(70));

  if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_CREEM_API_KEY_HERE') {
    console.log('⚠️  SKIP: API Key not configured');
  } else {
    let allValid = true;
    
    for (const [key, productId] of Object.entries(CONFIG.productIds)) {
      if (!productId) {
        console.log(`   ⚠️  ${key}: Not configured`);
        continue;
      }

      try {
        const response = await fetch(`${baseUrl}/v1/checkouts`, {
          method: 'POST',
          headers: {
            'x-api-key': CONFIG.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId,
            units: 1,
            customer: { email: 'test@example.com' },
            success_url: 'https://example.com/success',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ ${key}: Valid (${productId})`);
        } else {
          const errorData = await response.json();
          console.log(`   ❌ ${key}: Invalid (${productId})`);
          console.log(`      Error: ${errorData.error?.message || 'Unknown error'}`);
          allValid = false;
        }
      } catch (error) {
        console.log(`   ❌ ${key}: Error - ${error.message}`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log('\n✅ All configured product IDs are valid');
      results.passed++;
    } else {
      console.log('\n❌ Some product IDs are invalid');
      results.failed++;
    }
    results.total++;
  }

  // 生成报告
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  // 建议
  console.log('\n' + '='.repeat(70));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(70));

  if (results.failed > 0) {
    console.log('\n1. 检查 Creem Dashboard 配置:');
    console.log('   - 访问: https://www.creem.io/dashboard');
    console.log('   - 验证 API Key: Settings > API Keys');
    console.log('   - 检查产品: Products > 确保产品状态为 Active');
    
    console.log('\n2. 更新环境变量 (.env.local):');
    console.log('   CREEM_API_KEY=your_actual_api_key');
    console.log('   CREEM_ENVIRONMENT=sandbox');
    console.log('   CREEM_PRODUCT_ID_SEED=prod_xxx');
    console.log('   CREEM_PRODUCT_ID_BASE=prod_xxx');
    console.log('   CREEM_PRODUCT_ID_PRO=prod_xxx');
    
    console.log('\n3. 在 Admin Settings 中配置产品 ID 映射:');
    console.log('   - 访问: /admin/settings/payment');
    console.log('   - 配置 creem_product_ids JSON 映射');
    console.log('   - 格式: {"glow_seed": "prod_xxx", "glow_base": "prod_xxx", ...}');
  } else {
    console.log('\n✅ 所有测试通过！Creem 支付配置正确。');
  }

  console.log('\n' + '='.repeat(70));
  console.log('📚 Documentation: https://docs.creem.io/');
  console.log('='.repeat(70) + '\n');

  return results;
}

// 运行测试
testCreemPayment().catch(error => {
  console.error('\n❌ Test execution failed:');
  console.error(error);
  process.exit(1);
});

