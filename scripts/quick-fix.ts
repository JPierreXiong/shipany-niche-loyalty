/**
 * Quick Fix Script for Glow System Issues
 * Addresses critical problems found in testing
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

async function runQuickFix() {
  console.log('🔧 Glow Quick Fix Script\n');
  console.log('='.repeat(60));

  // 1. Check Environment Variables
  console.log('\n📋 Checking Environment Variables...\n');

  const requiredVars = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'BETTER_AUTH_SECRET': process.env.BETTER_AUTH_SECRET,
    'BETTER_AUTH_URL': process.env.BETTER_AUTH_URL,
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
  };

  const shopifyVars = {
    'SHOPIFY_CLIENT_ID': process.env.SHOPIFY_CLIENT_ID,
    'SHOPIFY_CLIENT_SECRET': process.env.SHOPIFY_CLIENT_SECRET,
    'SHOPIFY_API_KEY': process.env.SHOPIFY_API_KEY,
    'SHOPIFY_API_SECRET': process.env.SHOPIFY_API_SECRET,
  };

  let hasIssues = false;

  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      console.log(`✅ ${key}: Set`);
    } else {
      console.log(`❌ ${key}: Missing`);
      hasIssues = true;
    }
  }

  console.log('\n📦 Shopify Configuration:');
  for (const [key, value] of Object.entries(shopifyVars)) {
    if (value) {
      console.log(`✅ ${key}: Set`);
    } else {
      console.log(`⚠️  ${key}: Not set`);
    }
  }

  // 2. Check Database Connection
  console.log('\n🗄️  Testing Database Connection...\n');

  try {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = await import('postgres');
    
    if (!process.env.DATABASE_URL) {
      console.log('❌ DATABASE_URL not set');
    } else {
      const client = postgres.default(process.env.DATABASE_URL);
      const db = drizzle(client);
      
      // Test query
      const result = await client`SELECT 1 as test`;
      console.log('✅ Database connection successful');
      console.log('   Result:', result);
      
      await client.end();
    }
  } catch (error: any) {
    console.log('❌ Database connection failed');
    console.log('   Error:', error.message);
    hasIssues = true;
  }

  // 3. Check API Routes
  console.log('\n🔌 Checking API Routes...\n');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Try different ports
  const ports = [3000, 3004, 3001];
  let workingPort = null;

  for (const port of ports) {
    try {
      const testUrl = `http://localhost:${port}/api/niche-loyalty/config`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(testUrl, { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.status !== 404) {
        workingPort = port;
        console.log(`✅ Server found on port ${port}`);
        break;
      }
    } catch (error) {
      // Port not available
    }
  }

  if (!workingPort) {
    console.log('⚠️  No server found on common ports (3000, 3004, 3001)');
    console.log('   Please start the dev server: pnpm dev');
  } else {
    console.log(`\n📡 Testing API endpoints on port ${workingPort}...\n`);
    
    const endpoints = [
      '/api/auth/sign-in',
      '/api/auth/sign-up',
      '/api/niche-loyalty/config',
      '/api/niche-loyalty/members/list',
    ];
    
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`http://localhost:${workingPort}${endpoint}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 404) {
          console.log(`❌ ${endpoint}: Not found (404)`);
          hasIssues = true;
        } else if (response.status === 401) {
          console.log(`✅ ${endpoint}: Exists (requires auth)`);
        } else {
          console.log(`✅ ${endpoint}: Accessible (${response.status})`);
        }
      } catch (error: any) {
        console.log(`⚠️  ${endpoint}: ${error.message}`);
      }
    }
  }

  // 4. Summary and Recommendations
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary\n');

  if (hasIssues) {
    console.log('❌ Issues found that need attention:\n');
    
    if (!process.env.BETTER_AUTH_SECRET) {
      console.log('1. Generate BETTER_AUTH_SECRET:');
      console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
      console.log('   Add to .env.local\n');
    }
    
    if (!process.env.BETTER_AUTH_URL) {
      console.log('2. Set BETTER_AUTH_URL in .env.local:');
      console.log('   BETTER_AUTH_URL=http://localhost:3000\n');
    }
    
    console.log('3. Restart the development server:');
    console.log('   pnpm dev\n');
    
    console.log('4. Run database migrations:');
    console.log('   pnpm db:push\n');
    
    console.log('5. Re-run this script to verify fixes:');
    console.log('   npx tsx scripts/quick-fix.ts\n');
  } else {
    console.log('✅ All critical checks passed!\n');
    console.log('Next steps:');
    console.log('1. Run full test suite: npx tsx scripts/test-glow-complete.ts');
    console.log('2. Test in browser: http://localhost:' + (workingPort || 3000));
    console.log('3. Check documentation: ENV_SETUP_COMPLETE.md\n');
  }

  console.log('='.repeat(60));
  console.log('\n✨ Quick fix check complete!\n');
}

// Run the script
runQuickFix().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
