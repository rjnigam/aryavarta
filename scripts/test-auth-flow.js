#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAuthFlow() {
  console.log('🔍 Testing Supabase Auth Flow\n');

  // 1. Test getting current user
  console.log('1. Getting current user...');
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.log('   ❌ Error:', userError.message);
  } else if (user) {
    console.log('   ✅ Logged in user:', user.email);
    console.log('   📧 Email verified:', user.email_confirmed_at ? 'Yes' : 'No');
    console.log('   🆔 User ID:', user.id);
  } else {
    console.log('   ℹ️  No user logged in');
  }

  // 2. Test session
  console.log('\n2. Getting session...');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.log('   ❌ Error:', sessionError.message);
  } else if (session) {
    console.log('   ✅ Active session found');
    console.log('   ⏰ Expires at:', new Date(session.expires_at * 1000).toLocaleString());
  } else {
    console.log('   ℹ️  No active session');
  }

  // 3. If user is logged in, check subscriber record
  if (user) {
    console.log('\n3. Checking subscriber record...');
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    if (subError) {
      console.log('   ❌ Error:', subError.message);
    } else if (subscriber) {
      console.log('   ✅ Subscriber found');
      console.log('   👤 Username:', subscriber.username);
      console.log('   📛 Name:', subscriber.name);
      console.log('   ✓ Email verified:', subscriber.email_verified ? 'Yes' : 'No');
    } else {
      console.log('   ⚠️  No subscriber record found');
    }
  }

  console.log('\n✨ Auth flow test complete');
}

testAuthFlow().catch(console.error);