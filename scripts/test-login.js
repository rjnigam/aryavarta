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

async function testLogin(email, password) {
  console.log('🔍 Testing Login\n');

  console.log(`Attempting to login with email: ${email}`);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('❌ Login failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error:', JSON.stringify(error, null, 2));
  } else if (data.user) {
    console.log('✅ Login successful!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Email verified:', data.user.email_confirmed_at ? 'Yes' : 'No');
    console.log('Session:', data.session ? 'Created' : 'Not created');
    
    if (data.user.user_metadata) {
      console.log('Username:', data.user.user_metadata.username);
      console.log('Name:', data.user.user_metadata.name);
    }
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node test-login.js <email> <password>');
  process.exit(1);
}

testLogin(email, password).catch(console.error);