/**
 * Creem Payment Test Script
 * 测试 Creem 支付集成并生成诊断报告
 */

import { createCreemProvider } from './src/extensions/payment/creem';
import { PaymentOrder, PaymentType, PaymentInterval } from './src/extensions/payment';

// 测试配置
const TEST_CONFIG = {
  apiKey: process.env.CREEM_API_KEY || '',
  signingSecret: process.env.CREEM_SIGNING_SECRET || '',
  environment: (process.env.CREEM_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
};

// 测试产品 ID（从你的 pricing 配置中获取）
const TEST_PRODUCTS = {
  glow_seed: process.env.CREEM_PRODUCT_ID_SEED || '',
  glow_base: process.env.CREEM_PRODUCT_ID_BASE || '',
  glow_pro: process.env.CREEM_PRODUCT_ID_PRO || '',
};

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  details?: any;
  error?: any;
}

class CreemPaymentTester {
  private results: TestResult[] = [];
  private provider: any;

  constructor() {
    console.log('🔍 Creem Payment Diagnostic Tool\n');
    console.log('=' .repeat(60));
  }

  // 测试 1: 检查环境变量配置
  async testEnvironmentVariables(): Promise<TestResult> {
    console.log('\n📋 Test 1: Environment Variables Configuration');
    console.log('-'.repeat(60));

    const issues: string[] = [];
    const details: any = {};

    // 检查 API Key
    if (!TEST_CONFIG.apiKey) {
      issues.push('CREEM_API_KEY is not set');
      details.apiKey = '❌ Missing';
    } else if (TEST_CONFIG.apiKey.length < 20) {
      issues.push('CREEM_API_KEY appears to be invalid (too short)');
      details.apiKey = '⚠️ Invalid format';
    } else {
      details.apiKey = `✅ Set (${TEST_CONFIG.apiKey.substring(0, 10)}...)`;
    }

    // 检查 Signing Secret
    if (!TEST_CONFIG.signingSecret) {
      issues.push('CREEM_SIGNING_SECRET is not set (required for webhooks)');
      details.signingSecret = '⚠️ Missing (optional for checkout)';
    } else {
      details.signingSecret = `✅ Set (${TEST_CONFIG.signingSecret.substring(0, 10)}...)`;
    }

    // 检查环境
    details.environment = `✅ ${TEST_CONFIG.environment}`;

    // 检查产品 ID
    const productIds: any = {};
    let hasAnyProductId = false;

    for (const [key, value] of Object.entries(TEST_PRODUCTS)) {
      if (value) {
        productIds[key] = `✅ ${value}`;
        hasAnyProductId = true;
      } else {
        productIds[key] = '❌ Not configured';
        issues.push(`Product ID for ${key} is not set`);
      }
    }

    details.productIds = productIds;

    if (!hasAnyProductId) {
      issues.push('No product IDs configured. Please set CREEM_PRODUCT_ID_* environment variables');
    }

    console.log('API Key:', details.apiKey);
    console.log('Signing Secret:', details.signingSecret);
    console.log('Environment:', details.environment);
    console.log('\nProduct IDs:');
    for (const [key, value] of Object.entries(productIds)) {
      console.log(`  ${key}:`, value);
    }

    if (issues.length > 0) {
      console.log('\n⚠️ Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
      return {
        testName: 'Environment Variables',
        status: 'FAIL',
        message: `Found ${issues.length} configuration issue(s)`,
        details,
      };
    }

    return {
      testName: 'Environment Variables',
      status: 'PASS',
      message: 'All environment variables are properly configured',
      details,
    };
  }

  // 测试 2: 测试 Creem API 连接
  async testApiConnection(): Promise<TestResult> {
    console.log('\n🌐 Test 2: Creem API Connection');
    console.log('-'.repeat(60));

    if (!TEST_CONFIG.apiKey) {
      console.log('❌ Skipped: API Key not configured');
      return {
        testName: 'API Connection',
        status: 'SKIP',
        message: 'API Key not configured',
      };
    }

    try {
      this.provider = createCreemProvider(TEST_CONFIG);
      
      const baseUrl = TEST_CONFIG.environment === 'production'
        ? 'https://api.creem.io'
        : 'https://test-api.creem.io';

      console.log(`Testing connection to: ${baseUrl}`);

      // 尝试获取一个不存在的 checkout（用于测试 API 连接）
      const testUrl = `${baseUrl}/v1/checkouts?checkout_id=test_connection_check`;
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'x-api-key': TEST_CONFIG.apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response status: ${response.status}`);

      // 401 = API key invalid
      // 404 = API key valid but checkout not found (expected)
      // 200 = API key valid and checkout found (unlikely but ok)
      
      if (response.status === 401) {
        const errorData = await response.json();
        console.log('❌ Authentication failed');
        console.log('Error:', errorData);
        return {
          testName: 'API Connection',
          status: 'FAIL',
          message: 'Invalid API Key - Authentication failed',
          details: { status: response.status, error: errorData },
        };
      }

      if (response.status === 404 || response.status === 200) {
        console.log('✅ API connection successful');
        return {
          testName: 'API Connection',
          status: 'PASS',
          message: 'Successfully connected to Creem API',
          details: { status: response.status, baseUrl },
        };
      }

      // 其他状态码
      const errorData = await response.json();
      console.log('⚠️ Unexpected response');
      console.log('Response:', errorData);
      return {
        testName: 'API Connection',
        status: 'FAIL',
        message: `Unexpected response status: ${response.status}`,
        details: { status: response.status, error: errorData },
      };

    } catch (error: any) {
      console.log('❌ Connection failed');
      console.log('Error:', error.message);
      return {
        testName: 'API Connection',
        status: 'FAIL',
        message: 'Failed to connect to Creem API',
        error: error.message,
      };
    }
  }

  // 测试 3: 测试创建 Checkout Session
  async testCreateCheckout(): Promise<TestResult> {
    console.log('\n💳 Test 3: Create Checkout Session');
    console.log('-'.repeat(60));

    if (!this.provider) {
      console.log('❌ Skipped: Provider not initialized');
      return {
        testName: 'Create Checkout',
        status: 'SKIP',
        message: 'Provider not initialized (previous test failed)',
      };
    }

    // 找到第一个配置的产品 ID
    let testProductId = '';
    let testProductName = '';
    for (const [key, value] of Object.entries(TEST_PRODUCTS)) {
      if (value) {
        testProductId = value;
        testProductName = key;
        break;
      }
    }

    if (!testProductId) {
      console.log('❌ Skipped: No product ID configured');
      return {
        testName: 'Create Checkout',
        status: 'SKIP',
        message: 'No product ID configured for testing',
      };
    }

    console.log(`Testing with product: ${testProductName} (${testProductId})`);

    try {
      const testOrder: PaymentOrder = {
        productId: testProductId,
        type: PaymentType.SUBSCRIPTION,
        customer: {
          email: 'test@example.com',
          name: 'Test User',
        },
        description: `Test checkout for ${testProductName}`,
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        metadata: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('Creating checkout session...');
      const result = await this.provider.createPayment({ order: testOrder });

      console.log('✅ Checkout session created successfully');
      console.log('Session ID:', result.checkoutInfo.sessionId);
      console.log('Checkout URL:', result.checkoutInfo.checkoutUrl);

      return {
        testName: 'Create Checkout',
        status: 'PASS',
        message: 'Successfully created checkout session',
        details: {
          sessionId: result.checkoutInfo.sessionId,
          checkoutUrl: result.checkoutInfo.checkoutUrl,
          productId: testProductId,
        },
      };

    } catch (error: any) {
      console.log('❌ Failed to create checkout');
      console.log('Error:', error.message);

      // 分析错误原因
      let diagnosis = '';
      if (error.message.includes('status: 400')) {
        diagnosis = 'Bad Request - Possible causes:\n' +
          '  1. Invalid product ID\n' +
          '  2. Product not found in Creem dashboard\n' +
          '  3. Product is archived or inactive\n' +
          '  4. Missing required fields in request';
      } else if (error.message.includes('status: 401')) {
        diagnosis = 'Unauthorized - API key is invalid or expired';
      } else if (error.message.includes('status: 404')) {
        diagnosis = 'Not Found - API endpoint may have changed';
      } else if (error.message.includes('productId is required')) {
        diagnosis = 'Product ID is required but not provided';
      }

      return {
        testName: 'Create Checkout',
        status: 'FAIL',
        message: 'Failed to create checkout session',
        error: error.message,
        details: {
          diagnosis,
          productId: testProductId,
        },
      };
    }
  }

  // 测试 4: 验证产品 ID 在 Creem 中是否存在
  async testProductIdValidity(): Promise<TestResult> {
    console.log('\n🔍 Test 4: Product ID Validity Check');
    console.log('-'.repeat(60));

    if (!TEST_CONFIG.apiKey) {
      console.log('❌ Skipped: API Key not configured');
      return {
        testName: 'Product ID Validity',
        status: 'SKIP',
        message: 'API Key not configured',
      };
    }

    const results: any = {};
    let allValid = true;

    for (const [key, productId] of Object.entries(TEST_PRODUCTS)) {
      if (!productId) {
        results[key] = '⚠️ Not configured';
        continue;
      }

      console.log(`\nChecking ${key}: ${productId}`);

      try {
        // 尝试创建一个测试 checkout 来验证产品 ID
        const baseUrl = TEST_CONFIG.environment === 'production'
          ? 'https://api.creem.io'
          : 'https://test-api.creem.io';

        const response = await fetch(`${baseUrl}/v1/checkouts`, {
          method: 'POST',
          headers: {
            'x-api-key': TEST_CONFIG.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId,
            units: 1,
            customer: {
              email: 'test@example.com',
            },
            success_url: 'https://example.com/success',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          results[key] = `✅ Valid (checkout created: ${data.id})`;
          console.log(`  ✅ Product ID is valid`);
        } else {
          const errorData = await response.json();
          results[key] = `❌ Invalid (${response.status}: ${errorData.error?.message || 'Unknown error'})`;
          console.log(`  ❌ Product ID is invalid or not found`);
          console.log(`  Error:`, errorData);
          allValid = false;
        }
      } catch (error: any) {
        results[key] = `❌ Error: ${error.message}`;
        console.log(`  ❌ Error checking product:`, error.message);
        allValid = false;
      }
    }

    console.log('\n📊 Product ID Validation Results:');
    for (const [key, result] of Object.entries(results)) {
      console.log(`  ${key}: ${result}`);
    }

    return {
      testName: 'Product ID Validity',
      status: allValid ? 'PASS' : 'FAIL',
      message: allValid 
        ? 'All configured product IDs are valid' 
        : 'Some product IDs are invalid or not found',
      details: results,
    };
  }

  // 生成测试报告
  generateReport() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC REPORT');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    console.log(`\nTotal Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Skipped: ${skipped}`);

    console.log('\n' + '-'.repeat(60));
    console.log('Test Results:');
    console.log('-'.repeat(60));

    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`\n${index + 1}. ${icon} ${result.testName}: ${result.status}`);
      console.log(`   ${result.message}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }

      if (result.details?.diagnosis) {
        console.log(`   Diagnosis: ${result.details.diagnosis}`);
      }
    });

    // 生成建议
    console.log('\n' + '='.repeat(60));
    console.log('💡 RECOMMENDATIONS');
    console.log('='.repeat(60));

    const recommendations: string[] = [];

    // 检查失败的测试并给出建议
    this.results.forEach(result => {
      if (result.status === 'FAIL') {
        if (result.testName === 'Environment Variables') {
          recommendations.push(
            '1. Configure missing environment variables in .env.local:\n' +
            '   - CREEM_API_KEY=your_api_key\n' +
            '   - CREEM_SIGNING_SECRET=your_signing_secret\n' +
            '   - CREEM_ENVIRONMENT=sandbox (or production)\n' +
            '   - CREEM_PRODUCT_ID_SEED=your_seed_product_id\n' +
            '   - CREEM_PRODUCT_ID_BASE=your_base_product_id\n' +
            '   - CREEM_PRODUCT_ID_PRO=your_pro_product_id'
          );
        }

        if (result.testName === 'API Connection') {
          recommendations.push(
            '2. Verify your Creem API credentials:\n' +
            '   - Log in to https://www.creem.io/dashboard\n' +
            '   - Go to Settings > API Keys\n' +
            '   - Copy the correct API key for your environment'
          );
        }

        if (result.testName === 'Create Checkout' || result.testName === 'Product ID Validity') {
          recommendations.push(
            '3. Create and configure products in Creem Dashboard:\n' +
            '   - Visit https://www.creem.io/dashboard/products\n' +
            '   - Create products matching your pricing tiers\n' +
            '   - Copy the product IDs and add them to your .env.local\n' +
            '   - Ensure products are active and not archived'
          );
        }
      }
    });

    if (recommendations.length === 0) {
      console.log('\n✅ All tests passed! Your Creem payment integration is properly configured.');
    } else {
      recommendations.forEach(rec => console.log(`\n${rec}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log('For more help, visit: https://docs.creem.io/');
    console.log('='.repeat(60) + '\n');
  }

  // 运行所有测试
  async runAllTests() {
    this.results.push(await this.testEnvironmentVariables());
    this.results.push(await this.testApiConnection());
    this.results.push(await this.testCreateCheckout());
    this.results.push(await this.testProductIdValidity());
    
    this.generateReport();
  }
}

// 运行测试
async function main() {
  const tester = new CreemPaymentTester();
  await tester.runAllTests();
}

main().catch(console.error);

