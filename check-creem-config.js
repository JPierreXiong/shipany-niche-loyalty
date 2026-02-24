/**
 * Creem Configuration Checker
 * 快速检查 Creem 配置是否正确
 */

const REQUIRED_CONFIG = {
  apiKey: 'creem_test_1i7654OnZ1pk67vqY87wS6',
  environment: 'sandbox',
  products: {
    base: 'prod_5bo10kkVzObfuZIjUglgI0',
    pro: 'prod_1lQWMwrdWZFzo6AgpVcCc7',
  }
};

async function checkCreemConfig() {
  console.log('🔍 Checking Creem Configuration...\n');
  console.log('='.repeat(70));
  
  let allPassed = true;

  // Test 1: API Connection
  console.log('\n📡 Test 1: API Connection');
  console.log('-'.repeat(70));
  
  try {
    const response = await fetch('https://test-api.creem.io/v1/checkouts?checkout_id=test', {
      headers: {
        'x-api-key': REQUIRED_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      console.log('❌ FAIL: Invalid API Key');
      console.log('   Please check your API key in Creem Dashboard');
      allPassed = false;
    } else if (response.status === 404 || response.status === 200) {
      console.log('✅ PASS: API Key is valid');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log(`⚠️  WARNING: Unexpected status ${response.status}`);
    }
  } catch (error) {
    console.log('❌ FAIL: Connection error');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // Test 2: Base Product
  console.log('\n💳 Test 2: Base Product ($19.9)');
  console.log('-'.repeat(70));
  
  try {
    const response = await fetch('https://test-api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': REQUIRED_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: REQUIRED_CONFIG.products.base,
        units: 1,
        customer: { email: 'test@example.com' },
        success_url: 'https://example.com/success',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ PASS: Base product is valid');
      console.log(`   Product ID: ${REQUIRED_CONFIG.products.base}`);
      console.log(`   Checkout ID: ${data.id}`);
      console.log(`   Checkout URL: ${data.checkout_url}`);
    } else {
      const error = await response.json();
      console.log('❌ FAIL: Base product is invalid');
      console.log(`   Product ID: ${REQUIRED_CONFIG.products.base}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(error, null, 2)}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // Test 3: Pro Product
  console.log('\n💎 Test 3: Pro Product ($59.9)');
  console.log('-'.repeat(70));
  
  try {
    const response = await fetch('https://test-api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': REQUIRED_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: REQUIRED_CONFIG.products.pro,
        units: 1,
        customer: { email: 'test@example.com' },
        success_url: 'https://example.com/success',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ PASS: Pro product is valid');
      console.log(`   Product ID: ${REQUIRED_CONFIG.products.pro}`);
      console.log(`   Checkout ID: ${data.id}`);
      console.log(`   Checkout URL: ${data.checkout_url}`);
    } else {
      const error = await response.json();
      console.log('❌ FAIL: Pro product is invalid');
      console.log(`   Product ID: ${REQUIRED_CONFIG.products.pro}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(error, null, 2)}`);
      allPassed = false;
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  if (allPassed) {
    console.log('\n✅ All tests passed!');
    console.log('\nYour Creem configuration is correct.');
    console.log('If you still see 400 errors on Vercel:');
    console.log('1. Make sure environment variables are set in Vercel');
    console.log('2. Redeploy your Vercel project');
    console.log('3. Clear browser cache and try again');
  } else {
    console.log('\n❌ Some tests failed!');
    console.log('\nPlease fix the issues above and try again.');
    console.log('\nCommon fixes:');
    console.log('1. Check API Key in Creem Dashboard');
    console.log('2. Verify Product IDs are correct');
    console.log('3. Ensure products are Active (not archived)');
    console.log('4. Confirm you are using the correct environment (sandbox)');
  }

  console.log('\n' + '='.repeat(70));
  console.log('📚 Resources:');
  console.log('- Creem Dashboard: https://www.creem.io/dashboard');
  console.log('- API Keys: https://www.creem.io/dashboard/settings/api');
  console.log('- Products: https://www.creem.io/dashboard/products');
  console.log('- Documentation: https://docs.creem.io/');
  console.log('='.repeat(70) + '\n');
}

// Run the checker
checkCreemConfig().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});








