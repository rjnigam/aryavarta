const { createClient } = require('@supabase/supabase-js');

async function diagnoseEmailIssue() {
  console.log('🔍 Diagnosing Email Verification Issue\n');
  
  // Check environment variables
  console.log('1️⃣ Checking Environment Variables:');
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  };
  
  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.log(`   ❌ ${key}: NOT SET`);
    } else if (key.includes('KEY')) {
      console.log(`   ✅ ${key}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`   ✅ ${key}: ${value}`);
    }
  }
  
  if (!envVars.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n⚠️  CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!');
    console.log('   This is required for sending verification emails via Resend fallback.');
    return;
  }
  
  console.log('\n2️⃣ Testing Supabase Connection:');
  try {
    const supabase = createClient(
      envVars.NEXT_PUBLIC_SUPABASE_URL,
      envVars.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { data, error } = await supabase.auth.admin.listUsers({ 
      page: 1, 
      perPage: 1 
    });
    
    if (error) {
      console.log(`   ❌ Admin API Error: ${error.message}`);
    } else {
      console.log(`   ✅ Admin API is accessible`);
    }
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}`);
  }
  
  console.log('\n3️⃣ Common Email Issues:');
  console.log('   • Check Supabase Dashboard → Authentication → Email Templates');
  console.log('   • Ensure "Enable email confirmations" is ON');
  console.log('   • Check if custom SMTP is configured (affects email delivery)');
  console.log('   • Look for rate limiting in Supabase Dashboard → Logs');
  
  console.log('\n4️⃣ Resend Configuration:');
  if (envVars.RESEND_API_KEY && envVars.RESEND_API_KEY.startsWith('re_')) {
    console.log('   ✅ Resend API key format is correct');
    console.log('   • Check Resend dashboard for delivery logs');
    console.log('   • Verify domain is configured: arya-varta.in');
  } else {
    console.log('   ❌ Invalid or missing Resend API key');
  }
  
  console.log('\n5️⃣ Next Steps:');
  console.log('   1. Check spam/junk folder for emails');
  console.log('   2. Try with a different email provider (Gmail vs Outlook)');
  console.log('   3. Check Supabase Dashboard → Logs for auth.signup events');
  console.log('   4. Manually confirm user in Supabase Dashboard for testing');
}

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
} catch (err) {
  console.error('Failed to load .env.local:', err.message);
}

diagnoseEmailIssue().catch(console.error);