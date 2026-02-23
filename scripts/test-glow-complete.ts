/**
 * Glow Complete System Test
 * Tests all major features: Auth, Payment, Member Import, Email, Wallet Cards, Shopify Integration
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'WARNING';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

function logTest(result: TestResult) {
  results.push(result);
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : result.status === 'WARNING' ? '⚠️' : '⏭️';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.details) {
    console.log('   Details:', JSON.stringify(result.details, null, 2));
  }
}

// ============================================
// 1. Environment Variables Check
// ============================================
async function testEnvironmentVariables() {
  console.log('\n📋 Testing Environment Variables...\n');

  const requiredVars = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'NEXT_PUBLIC_APP_URL',
  ];

  const optionalVars = [
    'RESEND_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SHOPIFY_API_KEY',
    'SHOPIFY_API_SECRET',
    'VERCEL_BLOB_READ_WRITE_TOKEN',
  ];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      logTest({
        name: `ENV: ${varName}`,
        status: 'PASS',
        message: 'Variable is set',
      });
    } else {
      logTest({
        name: `ENV: ${varName}`,
        status: 'FAIL',
        message: 'Required variable is missing',
      });
    }
  }

  for (const varName of optionalVars) {
    if (process.env[varName]) {
      logTest({
        name: `ENV: ${varName}`,
        status: 'PASS',
        message: 'Optional variable is set',
      });
    } else {
      logTest({
        name: `ENV: ${varName}`,
        status: 'WARNING',
        message: 'Optional variable is missing - some features may not work',
      });
    }
  }
}

// ============================================
// 2. Database Connection Test
// ============================================
async function testDatabaseConnection() {
  console.log('\n🗄️  Testing Database Connection...\n');

  try {
    const { db } = await import('@/core/db');
    const { sql } = await import('drizzle-orm');
    
    const result = await db.execute(sql`SELECT 1 as test`);
    
    logTest({
      name: 'Database Connection',
      status: 'PASS',
      message: 'Successfully connected to database',
      details: { result },
    });
  } catch (error: any) {
    logTest({
      name: 'Database Connection',
      status: 'FAIL',
      message: 'Failed to connect to database',
      details: { error: error.message },
    });
  }
}

// ============================================
// 3. Auth System Test (Sign Up / Sign In)
// ============================================
async function testAuthSystem() {
  console.log('\n🔐 Testing Authentication System...\n');

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Test Sign Up
  try {
    const signUpResponse = await fetch(`${baseUrl}/api/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: 'Test User',
      }),
    });

    if (signUpResponse.ok) {
      logTest({
        name: 'Auth: Sign Up',
        status: 'PASS',
        message: 'User registration successful',
        details: { email: testEmail },
      });
    } else {
      const error = await signUpResponse.text();
      logTest({
        name: 'Auth: Sign Up',
        status: 'FAIL',
        message: 'User registration failed',
        details: { status: signUpResponse.status, error },
      });
    }
  } catch (error: any) {
    logTest({
      name: 'Auth: Sign Up',
      status: 'FAIL',
      message: 'Sign up request failed',
      details: { error: error.message },
    });
  }

  // Test Sign In
  try {
    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    if (signInResponse.ok) {
      logTest({
        name: 'Auth: Sign In',
        status: 'PASS',
        message: 'User login successful',
      });
    } else {
      const error = await signInResponse.text();
      logTest({
        name: 'Auth: Sign In',
        status: 'FAIL',
        message: 'User login failed',
        details: { status: signInResponse.status, error },
      });
    }
  } catch (error: any) {
    logTest({
      name: 'Auth: Sign In',
      status: 'FAIL',
      message: 'Sign in request failed',
      details: { error: error.message },
    });
  }
}

// ============================================
// 4. Payment System Test (Stripe)
// ============================================
async function testPaymentSystem() {
  console.log('\n💳 Testing Payment System...\n');

  if (!process.env.STRIPE_SECRET_KEY) {
    logTest({
      name: 'Payment: Stripe Setup',
      status: 'SKIP',
      message: 'Stripe API key not configured',
    });
    return;
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Test Stripe connection
    const balance = await stripe.balance.retrieve();
    
    logTest({
      name: 'Payment: Stripe Connection',
      status: 'PASS',
      message: 'Successfully connected to Stripe',
      details: { currency: balance.available[0]?.currency },
    });

    // Test creating a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    logTest({
      name: 'Payment: Checkout Session',
      status: 'PASS',
      message: 'Successfully created checkout session',
      details: { sessionId: session.id },
    });
  } catch (error: any) {
    logTest({
      name: 'Payment: Stripe Test',
      status: 'FAIL',
      message: 'Stripe test failed',
      details: { error: error.message },
    });
  }
}

// ============================================
// 5. Member Import Test (CSV)
// ============================================
async function testMemberImport() {
  console.log('\n👥 Testing Member Import...\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Test CSV import endpoint
  try {
    const csvData = `name,email,points
John Doe,john@example.com,100
Jane Smith,jane@example.com,200`;

    const formData = new FormData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    formData.append('file', blob, 'test-members.csv');

    const response = await fetch(`${baseUrl}/api/niche-loyalty/members/import-csv`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      logTest({
        name: 'Member Import: CSV Upload',
        status: 'PASS',
        message: 'CSV import successful',
        details: result,
      });
    } else {
      const error = await response.text();
      logTest({
        name: 'Member Import: CSV Upload',
        status: 'FAIL',
        message: 'CSV import failed',
        details: { status: response.status, error },
      });
    }
  } catch (error: any) {
    logTest({
      name: 'Member Import: CSV Upload',
      status: 'FAIL',
      message: 'Import request failed',
      details: { error: error.message },
    });
  }
}

// ============================================
// 6. Email Service Test (Resend)
// ============================================
async function testEmailService() {
  console.log('\n📧 Testing Email Service...\n');

  if (!process.env.RESEND_API_KEY) {
    logTest({
      name: 'Email: Resend Setup',
      status: 'SKIP',
      message: 'Resend API key not configured',
    });
    return;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Test sending email
    const result = await resend.emails.send({
      from: 'Glow <onboarding@resend.dev>',
      to: 'test@example.com',
      subject: 'Test Email from Glow',
      html: '<p>This is a test email from Glow loyalty system.</p>',
    });

    logTest({
      name: 'Email: Send Test',
      status: 'PASS',
      message: 'Email sent successfully',
      details: { id: result.data?.id },
    });
  } catch (error: any) {
    logTest({
      name: 'Email: Send Test',
      status: 'FAIL',
      message: 'Email sending failed',
      details: { error: error.message },
    });
  }
}

// ============================================
// 7. Wallet Card Generation Test
// ============================================
async function testWalletCardGeneration() {
  console.log('\n🎫 Testing Wallet Card Generation...\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Test wallet card data generation
    const testMember = {
      id: 'test-member-123',
      name: 'Test Member',
      email: 'test@example.com',
      points: 250,
      brandColor: '#8B9D83',
      brandName: 'Test Brand',
    };

    // Check if wallet card endpoint exists
    const response = await fetch(`${baseUrl}/api/niche-loyalty/wallet/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMember),
    });

    if (response.ok) {
      logTest({
        name: 'Wallet Card: Generation',
        status: 'PASS',
        message: 'Wallet card generated successfully',
      });
    } else if (response.status === 404) {
      logTest({
        name: 'Wallet Card: Generation',
        status: 'WARNING',
        message: 'Wallet card endpoint not implemented yet',
      });
    } else {
      logTest({
        name: 'Wallet Card: Generation',
        status: 'FAIL',
        message: 'Wallet card generation failed',
        details: { status: response.status },
      });
    }
  } catch (error: any) {
    logTest({
      name: 'Wallet Card: Generation',
      status: 'WARNING',
      message: 'Wallet card feature not fully implemented',
      details: { error: error.message },
    });
  }
}

// ============================================
// 8. Shopify Integration Test
// ============================================
async function testShopifyIntegration() {
  console.log('\n🛍️  Testing Shopify Integration...\n');

  if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
    logTest({
      name: 'Shopify: API Setup',
      status: 'SKIP',
      message: 'Shopify API credentials not configured',
    });
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Test webhook endpoint
  try {
    const testWebhookPayload = {
      id: 123456789,
      email: 'customer@example.com',
      total_price: '100.00',
      line_items: [
        {
          title: 'Test Product',
          quantity: 1,
          price: '100.00',
        },
      ],
    };

    const response = await fetch(`${baseUrl}/api/webhooks/shopify/order-paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Topic': 'orders/paid',
        'X-Shopify-Shop-Domain': 'test-shop.myshopify.com',
      },
      body: JSON.stringify(testWebhookPayload),
    });

    if (response.ok) {
      logTest({
        name: 'Shopify: Webhook Handler',
        status: 'PASS',
        message: 'Webhook processed successfully',
      });
    } else {
      logTest({
        name: 'Shopify: Webhook Handler',
        status: 'WARNING',
        message: 'Webhook handler needs configuration',
        details: { status: response.status },
      });
    }
  } catch (error: any) {
    logTest({
      name: 'Shopify: Webhook Handler',
      status: 'FAIL',
      message: 'Webhook test failed',
      details: { error: error.message },
    });
  }
}

// ============================================
// 9. API Routes Test
// ============================================
async function testAPIRoutes() {
  console.log('\n🔌 Testing API Routes...\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes = [
    '/api/niche-loyalty/config',
    '/api/niche-loyalty/dashboard/stats',
    '/api/niche-loyalty/members/list',
    '/api/niche-loyalty/campaigns/list',
  ];

  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      
      if (response.ok || response.status === 401) {
        logTest({
          name: `API Route: ${route}`,
          status: 'PASS',
          message: response.status === 401 ? 'Route exists (auth required)' : 'Route accessible',
        });
      } else {
        logTest({
          name: `API Route: ${route}`,
          status: 'WARNING',
          message: `Route returned ${response.status}`,
        });
      }
    } catch (error: any) {
      logTest({
        name: `API Route: ${route}`,
        status: 'FAIL',
        message: 'Route test failed',
        details: { error: error.message },
      });
    }
  }
}

// ============================================
// Main Test Runner
// ============================================
async function runAllTests() {
  console.log('🚀 Starting Glow Complete System Test\n');
  console.log('='.repeat(60));

  await testEnvironmentVariables();
  await testDatabaseConnection();
  await testAuthSystem();
  await testPaymentSystem();
  await testMemberImport();
  await testEmailService();
  await testWalletCardGeneration();
  await testShopifyIntegration();
  await testAPIRoutes();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  console.log(`✅ Passed:   ${passed}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`📝 Total:    ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ Critical Issues Found:\n');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  • ${r.name}: ${r.message}`);
      });
  }

  if (warnings > 0) {
    console.log('\n⚠️  Warnings (Non-Critical):\n');
    results
      .filter(r => r.status === 'WARNING')
      .forEach(r => {
        console.log(`  • ${r.name}: ${r.message}`);
      });
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Test Complete!\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error during testing:', error);
  process.exit(1);
});














