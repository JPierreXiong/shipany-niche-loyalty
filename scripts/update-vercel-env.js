/**
 * Update Vercel Environment Variables
 * 
 * This script updates environment variables for the Vercel project
 * Run: node scripts/update-vercel-env.js
 */

const https = require('https');

const VERCEL_TOKEN = 'mIN8fBX7YJjGjJUqvJb03Sui';
const PROJECT_NAME = 'glow_niche_loyalty';
const DOMAIN = 'https://glownicheloyalty.vercel.app';

// Environment variables to update
const ENV_VARS_TO_UPDATE = [
  {
    key: 'AUTH_URL',
    value: DOMAIN,
    target: ['production', 'preview', 'development']
  },
  {
    key: 'BETTER_AUTH_URL',
    value: DOMAIN,
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    value: DOMAIN,
    target: ['production', 'preview', 'development']
  }
];

// Environment variables to ensure exist
const ENV_VARS_TO_ENSURE = [
  {
    key: 'AUTH_SECRET',
    value: 'niche-loyalty-secret-key-production-2025',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'BETTER_AUTH_SECRET',
    value: 'niche-loyalty-secret-key-production-2025',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'DATABASE_URL',
    value: 'postgresql://neondb_owner:npg_cjqDLCsv1Q0r@ep-dawn-block-ahqazngy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'DATABASE_PROVIDER',
    value: 'postgresql',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NEXT_PUBLIC_APP_NAME',
    value: 'Glow',
    target: ['production', 'preview', 'development']
  },
  {
    key: 'NODE_ENV',
    value: 'production',
    target: ['production']
  }
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function getEnvVars() {
  console.log('📋 Fetching existing environment variables...');
  try {
    const response = await makeRequest('GET', `/v9/projects/${PROJECT_NAME}/env`);
    return response.envs || [];
  } catch (error) {
    console.error('❌ Failed to fetch env vars:', error.message);
    return [];
  }
}

async function deleteEnvVar(id) {
  try {
    await makeRequest('DELETE', `/v9/projects/${PROJECT_NAME}/env/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete env var ${id}:`, error.message);
    return false;
  }
}

async function createEnvVar(key, value, target) {
  try {
    await makeRequest('POST', `/v10/projects/${PROJECT_NAME}/env`, {
      key: key,
      value: value,
      type: 'encrypted',
      target: target
    });
    return true;
  } catch (error) {
    console.error(`❌ Failed to create env var ${key}:`, error.message);
    return false;
  }
}

async function updateEnvVars() {
  console.log('🚀 Starting Vercel environment variables update...\n');
  
  // Get existing env vars
  const existingVars = await getEnvVars();
  console.log(`✅ Found ${existingVars.length} existing environment variables\n`);

  // Update critical variables
  console.log('🔧 Updating critical environment variables...\n');
  
  for (const envVar of ENV_VARS_TO_UPDATE) {
    console.log(`📝 Processing ${envVar.key}...`);
    
    // Find existing variable
    const existing = existingVars.filter(v => v.key === envVar.key);
    
    if (existing.length > 0) {
      console.log(`   Found ${existing.length} existing entries, deleting...`);
      for (const v of existing) {
        await deleteEnvVar(v.id);
        console.log(`   ✅ Deleted old entry`);
      }
    }
    
    // Create new variable
    console.log(`   Creating new entry with value: ${envVar.value}`);
    const created = await createEnvVar(envVar.key, envVar.value, envVar.target);
    if (created) {
      console.log(`   ✅ Successfully created ${envVar.key}\n`);
    } else {
      console.log(`   ❌ Failed to create ${envVar.key}\n`);
    }
  }

  // Ensure other variables exist
  console.log('🔍 Checking other required environment variables...\n');
  
  for (const envVar of ENV_VARS_TO_ENSURE) {
    const existing = existingVars.find(v => v.key === envVar.key);
    
    if (!existing) {
      console.log(`📝 Creating missing variable: ${envVar.key}`);
      const created = await createEnvVar(envVar.key, envVar.value, envVar.target);
      if (created) {
        console.log(`   ✅ Successfully created ${envVar.key}\n`);
      } else {
        console.log(`   ❌ Failed to create ${envVar.key}\n`);
      }
    } else {
      console.log(`✅ ${envVar.key} already exists\n`);
    }
  }

  console.log('🎉 Environment variables update completed!\n');
  console.log('⚠️  IMPORTANT: You need to redeploy your project for changes to take effect.');
  console.log('   Visit: https://vercel.com/dashboard');
  console.log('   Go to your project → Deployments → Click "..." → Redeploy\n');
}

// Run the update
updateEnvVars().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});




