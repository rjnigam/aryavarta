-- =====================================================
-- SUBSCRIBER PROFILE PARITY MIGRATION
-- =====================================================
-- Goal: Ensure subscribers table is in perfect sync with auth.users
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- What this does:
-- 1. Backfills missing auth_user_id for existing subscribers
-- 2. Syncs email_verified status from auth.users
-- 3. Adds timestamps if missing
-- 4. Verifies triggers are working correctly
-- =====================================================

-- =====================================================
-- PART 1: VERIFICATION - Check Current State
-- =====================================================

-- 1.1: Check how many subscribers are missing auth_user_id
DO $$
DECLARE
  missing_auth_count INT;
  total_subscribers INT;
BEGIN
  SELECT COUNT(*) INTO total_subscribers FROM subscribers;
  SELECT COUNT(*) INTO missing_auth_count FROM subscribers WHERE auth_user_id IS NULL;
  
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'CURRENT STATE ANALYSIS';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'Total subscribers: %', total_subscribers;
  RAISE NOTICE 'Subscribers missing auth_user_id: %', missing_auth_count;
  RAISE NOTICE '───────────────────────────────────────────────────────────';
END $$;

-- 1.2: Check email verification status mismatches
SELECT 
  'Subscribers with mismatched email_verified status' AS check_name,
  COUNT(*) AS count
FROM subscribers s
INNER JOIN auth.users au ON s.auth_user_id = au.id
WHERE s.email_verified != (au.email_confirmed_at IS NOT NULL);

-- 1.3: Show sample of problematic records (if any)
SELECT 
  s.email,
  s.username,
  s.auth_user_id,
  s.email_verified AS sub_email_verified,
  (au.email_confirmed_at IS NOT NULL) AS auth_email_verified,
  au.email_confirmed_at,
  s.created_at AS sub_created_at,
  au.created_at AS auth_created_at
FROM subscribers s
LEFT JOIN auth.users au ON s.auth_user_id = au.id
WHERE s.auth_user_id IS NULL 
   OR s.email_verified != (au.email_confirmed_at IS NOT NULL)
LIMIT 10;

-- =====================================================
-- PART 2: BACKFILL - Link Subscribers to Auth Users
-- =====================================================

-- 2.1: Link subscribers to auth.users by matching email addresses
-- This handles subscribers created before auth was implemented
DO $$
DECLARE
  updated_count INT := 0;
BEGIN
  -- Update subscribers with matching auth users
  WITH matched_users AS (
    SELECT 
      s.email,
      au.id AS auth_user_id,
      (au.email_confirmed_at IS NOT NULL) AS verified_status
    FROM subscribers s
    INNER JOIN auth.users au ON LOWER(s.email) = LOWER(au.email)
    WHERE s.auth_user_id IS NULL
  )
  UPDATE subscribers s
  SET 
    auth_user_id = mu.auth_user_id,
    email_verified = mu.verified_status,
    updated_at = NOW()
  FROM matched_users mu
  WHERE s.email = mu.email;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'BACKFILL COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'Linked % subscribers to auth.users by email', updated_count;
  RAISE NOTICE '───────────────────────────────────────────────────────────';
END $$;

-- =====================================================
-- PART 3: SYNC EMAIL VERIFICATION STATUS
-- =====================================================

-- 3.1: Update email_verified for all subscribers based on auth.users
DO $$
DECLARE
  synced_count INT := 0;
BEGIN
  UPDATE subscribers s
  SET 
    email_verified = (au.email_confirmed_at IS NOT NULL),
    updated_at = NOW()
  FROM auth.users au
  WHERE s.auth_user_id = au.id
    AND s.email_verified != (au.email_confirmed_at IS NOT NULL);
  
  GET DIAGNOSTICS synced_count = ROW_COUNT;
  
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'EMAIL VERIFICATION SYNC COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'Updated % subscribers with correct verification status', synced_count;
  RAISE NOTICE '───────────────────────────────────────────────────────────';
END $$;

-- =====================================================
-- PART 4: ENSURE TIMESTAMPS ARE SET
-- =====================================================

-- 4.1: Set created_at for subscribers without timestamps
UPDATE subscribers
SET created_at = COALESCE(
  (SELECT au.created_at FROM auth.users au WHERE au.id = subscribers.auth_user_id),
  NOW()
)
WHERE created_at IS NULL;

-- 4.2: Set updated_at if missing
UPDATE subscribers
SET updated_at = NOW()
WHERE updated_at IS NULL;

-- =====================================================
-- PART 5: VERIFY TRIGGERS ARE WORKING
-- =====================================================

-- 5.1: Check if handle_new_user trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
  AND event_object_table = 'users'
  AND trigger_schema = 'auth';

-- 5.2: Check if email verification sync trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_updated'
  AND event_object_table = 'users'
  AND trigger_schema = 'auth';

-- =====================================================
-- PART 6: FINAL VERIFICATION
-- =====================================================

-- 6.1: Show final state
DO $$
DECLARE
  total_subs INT;
  with_auth INT;
  verified_count INT;
  unverified_count INT;
BEGIN
  SELECT COUNT(*) INTO total_subs FROM subscribers;
  SELECT COUNT(*) INTO with_auth FROM subscribers WHERE auth_user_id IS NOT NULL;
  SELECT COUNT(*) INTO verified_count FROM subscribers WHERE email_verified = TRUE;
  SELECT COUNT(*) INTO unverified_count FROM subscribers WHERE email_verified = FALSE;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'FINAL STATE AFTER MIGRATION';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE 'Total subscribers: %', total_subs;
  RAISE NOTICE 'Subscribers with auth_user_id: %', with_auth;
  RAISE NOTICE 'Email verified: %', verified_count;
  RAISE NOTICE 'Email not verified: %', unverified_count;
  RAISE NOTICE '───────────────────────────────────────────────────────────';
  RAISE NOTICE '';
  
  IF with_auth = total_subs THEN
    RAISE NOTICE '✅ SUCCESS: All subscribers linked to auth.users!';
  ELSE
    RAISE NOTICE '⚠️  WARNING: % subscribers still need auth accounts', (total_subs - with_auth);
  END IF;
  
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;

-- 6.2: Show any subscribers still without auth_user_id
-- These are subscribers who signed up via old flow and haven't created auth accounts yet
SELECT 
  'Subscribers still needing auth accounts' AS status,
  email,
  username,
  created_at,
  'User needs to sign up with password' AS action_needed
FROM subscribers
WHERE auth_user_id IS NULL
ORDER BY created_at DESC;

-- 6.3: Verify no mismatches remain
SELECT 
  'Email verification status matches' AS check_name,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All synced correctly'
    ELSE '❌ ' || COUNT(*) || ' mismatches found'
  END AS result
FROM subscribers s
INNER JOIN auth.users au ON s.auth_user_id = au.id
WHERE s.email_verified != (au.email_confirmed_at IS NOT NULL);

-- =====================================================
-- NOTES FOR SUBSCRIBERS WITHOUT AUTH ACCOUNTS
-- =====================================================
-- If there are subscribers without auth_user_id after this migration,
-- they are likely from the old email-only system.
--
-- Options to handle them:
-- 1. Send them a "Complete your account" email with signup link
-- 2. Auto-create auth accounts for them (requires password reset flow)
-- 3. Let them naturally sign up when they try to comment next time
-- =====================================================

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ All subscribers with auth accounts have auth_user_id populated
-- ✅ email_verified matches auth.users.email_confirmed_at
-- ✅ Triggers on_auth_user_created and on_auth_user_updated exist
-- ✅ created_at and updated_at are set for all subscribers
-- =====================================================
