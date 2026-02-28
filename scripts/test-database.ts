/**
 * Database Connection Test Script
 * Tests database connectivity and basic operations
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🗄️  Testing Database Connection\n');
  console.log('='.repeat(60));

  // 1. Check environment variables
  console.log('\n📋 Step 1: Checking Environment Variables\n');
  
  const dbUrl = process.env.DATABASE_URL;
  const dbUrlUnpooled = process.env.DATABASE_URL_UNPOOLED;
  
  if (!dbUrl) {
    console.log('❌ DATABASE_URL is not set');
    console.log('   Please check your .env.local file');
    return;
  }
  
  console.log('✅ DATABASE_URL is set');
  console.log('   URL:', dbUrl.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  if (dbUrlUnpooled) {
    console.log('✅ DATABASE_URL_UNPOOLED is set');
  }

  // 2. Test basic connection
  console.log('\n🔌 Step 2: Testing Basic Connection\n');
  
  try {
    const postgres = await import('postgres');
    const sql = postgres.default(dbUrl);
    
    console.log('Attempting to connect...');
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    
    console.log('✅ Connection successful!');
    console.log('   Test query result:', result[0]);
    
    await sql.end();
  } catch (error: any) {
    console.log('❌ Connection failed');
    console.log('   Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check if the database URL is correct');
    console.log('   2. Verify network connectivity');
    console.log('   3. Check if the database server is running');
    console.log('   4. Verify SSL settings (sslmode=require)');
    return;
  }

  // 3. Test Drizzle ORM
  console.log('\n🔧 Step 3: Testing Drizzle ORM\n');
  
  try {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const postgres = await import('postgres');
    
    const client = postgres.default(dbUrl);
    const db = drizzle(client);
    
    console.log('✅ Drizzle ORM initialized');
    
    // Test a simple query
    const result = await client`SELECT version()`;
    console.log('✅ Database version:', result[0].version);
    
    await client.end();
  } catch (error: any) {
    console.log('❌ Drizzle ORM test failed');
    console.log('   Error:', error.message);
    return;
  }

  // 4. Check database tables
  console.log('\n📊 Step 4: Checking Database Tables\n');
  
  try {
    const postgres = await import('postgres');
    const sql = postgres.default(dbUrl);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found in database');
      console.log('   You may need to run migrations:');
      console.log('   pnpm db:push');
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
    await sql.end();
  } catch (error: any) {
    console.log('⚠️  Could not check tables');
    console.log('   Error:', error.message);
  }

  // 5. Test Better Auth tables
  console.log('\n🔐 Step 5: Checking Better Auth Tables\n');
  
  try {
    const postgres = await import('postgres');
    const sql = postgres.default(dbUrl);
    
    const authTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user%' OR table_name LIKE '%session%'
      ORDER BY table_name
    `;
    
    if (authTables.length === 0) {
      console.log('⚠️  No auth tables found');
      console.log('   Run: pnpm auth:generate');
      console.log('   Then: pnpm db:push');
    } else {
      console.log(`✅ Found ${authTables.length} auth-related tables:`);
      authTables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    }
    
    await sql.end();
  } catch (error: any) {
    console.log('⚠️  Could not check auth tables');
    console.log('   Error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Database Connection Test Complete!\n');
  console.log('Next steps:');
  console.log('1. If no tables found, run: pnpm db:push');
  console.log('2. Start dev server: pnpm dev');
  console.log('3. Test in browser: http://localhost:3000');
  console.log('\n' + '='.repeat(60));
}

// Run the test
testDatabaseConnection().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

























