import postgres from 'postgres';

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  console.log(`📍 Host: ${databaseUrl.match(/@([^/]+)/)?.[1] || 'unknown'}\n`);

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(databaseUrl, {
      prepare: false,
      max: 1,
      idle_timeout: 10,
      connect_timeout: 10,
    });
    
    // Test basic query
    console.log('Testing basic query...');
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connection successful!');
    console.log(`⏰ Server time: ${result[0].current_time}`);
    console.log(`🗄️  PostgreSQL version: ${result[0].pg_version}\n`);

    // Test user table
    console.log('Testing user table...');
    const userCount = await sql`SELECT COUNT(*) as count FROM "user"`;
    console.log(`✅ User table accessible`);
    console.log(`👥 Total users: ${userCount[0].count}\n`);

    // Test session table
    console.log('Testing session table...');
    const sessionCount = await sql`SELECT COUNT(*) as count FROM "session"`;
    console.log(`✅ Session table accessible`);
    console.log(`🔐 Total sessions: ${sessionCount[0].count}\n`);

    console.log('✅ All database tests passed!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    
    if (sql) {
      await sql.end();
    }
    process.exit(1);
  }
}

testDatabaseConnection();

