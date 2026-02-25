/**
 * Run SQL Migration Script
 * Execute the Shopify credentials fields migration
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔗 Connecting to database...');
  const sql = postgres(databaseUrl);

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'add_shopify_credentials_fields.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Running migration: add_shopify_credentials_fields.sql');
    
    // Execute the migration
    await sql.unsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('\n📊 Verifying changes...');
    const result = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'loyalty_store' 
        AND column_name IN ('shopify_client_id', 'shopify_client_secret')
      ORDER BY column_name;
    `;
    
    console.log('\n✅ New columns added:');
    console.table(result);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();


