-- =====================================================
-- Phase 6: Password-Based Authentication Migration
-- =====================================================
-- This migration adds password authentication to Aryavarta
-- using Supabase Auth, linking auth.users with subscribers table
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- Step 1: Add password_hash column to subscribers (fallback if not using Supabase Auth)
-- Note: We'll primarily use Supabase Auth, but this provides a backup option
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Create index on auth_user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_auth_user_id ON subscribers(auth_user_id);

-- Step 3: Create a function to handle new user signups
-- This function automatically creates a subscriber record when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_username TEXT;
  username_exists BOOLEAN;
  attempt_count INT := 0;
  max_attempts INT := 20;
BEGIN
  -- Generate unique username from existing pool logic
  LOOP
    -- This will need to be called from application code
    -- For now, generate a temporary username
    generated_username := 'user_' || substring(NEW.id::text from 1 for 8);
    
    SELECT EXISTS(
      SELECT 1 FROM subscribers WHERE username = generated_username
    ) INTO username_exists;
    
    EXIT WHEN NOT username_exists OR attempt_count >= max_attempts;
    
    attempt_count := attempt_count + 1;
    generated_username := generated_username || '_' || attempt_count;
  END LOOP;

  -- Insert into subscribers table
  INSERT INTO subscribers (
    auth_user_id,
    email,
    name,
    username,
    is_active,
    email_verified,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    generated_username,
    TRUE,
    NEW.email_confirmed_at IS NOT NULL,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 5: Create function to sync email verification status
CREATE OR REPLACE FUNCTION sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE subscribers
  SET email_verified = NEW.email_confirmed_at IS NOT NULL,
      updated_at = NOW()
  WHERE auth_user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger for email verification sync
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_email_verification();

-- Step 7: Update RLS policies for subscribers table
-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read their own subscriber data" ON subscribers;
DROP POLICY IF EXISTS "Users can update their own subscriber data" ON subscribers;

-- Enable RLS on subscribers table
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscriber data
CREATE POLICY "Users can read their own subscriber data"
  ON subscribers
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Policy: Users can update their own subscriber data (name, username only)
CREATE POLICY "Users can update their own subscriber data"
  ON subscribers
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy: Service role can read all subscribers (for admin/moderation)
CREATE POLICY "Service role can read all subscribers"
  ON subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Step 8: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_username ON subscribers(username);
CREATE INDEX IF NOT EXISTS idx_subscribers_is_active ON subscribers(is_active);

-- Step 9: Add updated_at trigger for subscribers
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscribers_updated_at ON subscribers;
CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW EXECUTE FUNCTION update_subscribers_updated_at();

-- =====================================================
-- Migration for Existing Subscribers
-- =====================================================
-- This section helps migrate existing email-only subscribers
-- to the new auth system. Run this AFTER users have signed up
-- with passwords through the new system.

-- For existing subscribers without auth_user_id:
-- They will need to:
-- 1. Sign up with their existing email (Supabase will create auth.users)
-- 2. A background job can link their old subscriber record to new auth record
-- OR
-- 3. They can use a "claim account" flow with email verification

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if migration ran successfully:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'subscribers' 
-- AND column_name IN ('auth_user_id', 'email_verified', 'created_at', 'updated_at');

-- Check trigger was created:
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE event_object_table = 'users' 
-- AND trigger_schema = 'auth';

-- Check RLS policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'subscribers';

-- =====================================================
-- Rollback (if needed)
-- =====================================================
-- CAUTION: Only run this if you need to completely undo the migration

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
-- DROP TRIGGER IF EXISTS subscribers_updated_at ON subscribers;
-- DROP FUNCTION IF EXISTS handle_new_user();
-- DROP FUNCTION IF EXISTS sync_email_verification();
-- DROP FUNCTION IF EXISTS update_subscribers_updated_at();
-- DROP POLICY IF EXISTS "Users can read their own subscriber data" ON subscribers;
-- DROP POLICY IF EXISTS "Users can update their own subscriber data" ON subscribers;
-- DROP POLICY IF EXISTS "Service role can read all subscribers" ON subscribers;
-- ALTER TABLE subscribers DROP COLUMN IF EXISTS auth_user_id;
-- ALTER TABLE subscribers DROP COLUMN IF EXISTS email_verified;
-- ALTER TABLE subscribers DROP COLUMN IF EXISTS created_at;
-- ALTER TABLE subscribers DROP COLUMN IF EXISTS updated_at;
