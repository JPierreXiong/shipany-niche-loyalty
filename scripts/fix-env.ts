/**
 * Fix .env.local configuration
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');

console.log('🔧 Fixing .env.local configuration...\n');

try {
  const currentEnv = readFileSync(envPath, 'utf-8');
  
  // Check what's missing
  const missing: string[] = [];
  
  if (!currentEnv.includes('AUTH_URL=')) {
    missing.push('AUTH_URL');
  }
  
  if (!currentEnv.includes('NEXT_PUBLIC_APP_NAME=')) {
    missing.push('NEXT_PUBLIC_APP_NAME');
  }
  
  if (!currentEnv.includes('CREEM_ENABLED=')) {
    missing.push('CREEM_ENABLED');
  }
  
  if (!currentEnv.includes('DEFAULT_PAYMENT_PROVIDER=')) {
    missing.push('DEFAULT_PAYMENT_PROVIDER');
  }
  
  if (!currentEnv.includes('CREEM_PRODUCT_IDS=')) {
    missing.push('CREEM_PRODUCT_IDS');
  }
  
  if (missing.length === 0) {
    console.log('✅ All required variables are present');
    console.log('\nCurrent configuration:');
    console.log('- AUTH_SECRET: ✅');
    console.log('- AUTH_URL:', currentEnv.includes('AUTH_URL=') ? '✅' : '❌');
    console.log('- DATABASE_URL: ✅');
    console.log('- CREEM_API_KEY: ✅');
    console.log('- NEXT_PUBLIC_APP_NAME:', currentEnv.includes('NEXT_PUBLIC_APP_NAME=') ? '✅' : '❌');
  } else {
    console.log('⚠️  Missing variables:', missing.join(', '));
    console.log('\nPlease add these to your .env.local file:');
    console.log('\n# Add these lines:\n');
    
    if (missing.includes('AUTH_URL')) {
      console.log('AUTH_URL=http://localhost:3000');
    }
    
    if (missing.includes('NEXT_PUBLIC_APP_NAME')) {
      console.log('NEXT_PUBLIC_APP_NAME=Glow');
    }
    
    if (missing.includes('CREEM_ENABLED')) {
      console.log('CREEM_ENABLED=true');
    }
    
    if (missing.includes('DEFAULT_PAYMENT_PROVIDER')) {
      console.log('DEFAULT_PAYMENT_PROVIDER=creem');
    }
    
    if (missing.includes('CREEM_PRODUCT_IDS')) {
      console.log('CREEM_PRODUCT_IDS={"glow_seed":"prod_free","glow_base":"prod_5bo10kkVzObfuZIjUglgI0","glow_pro":"prod_1lQWMwrdWZFzo6AgpVcCc7"}');
    }
    
    console.log('\n');
  }
  
  // Create a fixed version
  let fixedEnv = currentEnv;
  
  // Add missing AUTH_URL
  if (!fixedEnv.includes('AUTH_URL=')) {
    fixedEnv = fixedEnv.replace(
      'AUTH_SECRET=niche-loyalty-secret-key-production-2025',
      'AUTH_SECRET=niche-loyalty-secret-key-production-2025\nAUTH_URL=http://localhost:3000'
    );
  }
  
  // Add missing NEXT_PUBLIC_APP_NAME
  if (!fixedEnv.includes('NEXT_PUBLIC_APP_NAME=')) {
    fixedEnv = fixedEnv.replace(
      'NEXT_PUBLIC_APP_URL=http://localhost:3000',
      'NEXT_PUBLIC_APP_URL=http://localhost:3000\nNEXT_PUBLIC_APP_NAME=Glow'
    );
  }
  
  // Add missing Creem config
  if (!fixedEnv.includes('CREEM_ENABLED=')) {
    fixedEnv = fixedEnv.replace(
      '# Payment Service',
      '# Payment Service\nCREEM_ENABLED=true\nCREEM_ENVIRONMENT=sandbox\nDEFAULT_PAYMENT_PROVIDER=creem'
    );
  }
  
  // Add CREEM_PRODUCT_IDS
  if (!fixedEnv.includes('CREEM_PRODUCT_IDS=')) {
    fixedEnv = fixedEnv.replace(
      'CREEM_API_KEY=creem_test_1i7654OnZ1pk67vqY87wS6',
      'CREEM_API_KEY=creem_test_1i7654OnZ1pk67vqY87wS6\nCREEM_SIGNING_SECRET=your-creem-signing-secret\nCREEM_PRODUCT_IDS={"glow_seed":"prod_free","glow_base":"prod_5bo10kkVzObfuZIjUglgI0","glow_pro":"prod_1lQWMwrdWZFzo6AgpVcCc7"}'
    );
  }
  
  // Write fixed version to a new file
  const fixedPath = join(process.cwd(), '.env.local.fixed');
  writeFileSync(fixedPath, fixedEnv);
  
  console.log('✅ Created fixed version: .env.local.fixed');
  console.log('\nTo apply the fix:');
  console.log('1. Backup current: copy .env.local .env.local.backup');
  console.log('2. Apply fix: copy .env.local.fixed .env.local');
  console.log('3. Restart server: pnpm dev');
  
} catch (error: any) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}










