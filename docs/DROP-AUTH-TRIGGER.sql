-- Drop the problematic trigger that's causing signup failures
-- This trigger was trying to insert into columns that don't exist in the subscribers table

-- Drop the triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop the trigger functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS sync_email_verification();

-- Note: After dropping these triggers, the /api/auth/signup route will 
-- manually create subscriber records using the correct table schema.
