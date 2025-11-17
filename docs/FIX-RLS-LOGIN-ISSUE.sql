-- Fix RLS policies for login issues
-- This fixes the issue where users can't create their subscriber record after login

-- First, check current policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'subscribers';

-- Update subscribers RLS policy to allow authenticated users to create their own record
CREATE POLICY "Users can create their own subscriber record" 
ON subscribers 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = auth_user_id OR auth.email() = email);

-- Update the existing select policy if needed
DROP POLICY IF EXISTS "Users can view their own subscriber record" ON subscribers;
CREATE POLICY "Users can view their own subscriber record" 
ON subscribers 
FOR SELECT 
TO authenticated 
USING (auth.uid() = auth_user_id OR auth.email() = email);

-- Update policy to allow users to update their own record
DROP POLICY IF EXISTS "Users can update their own subscriber record" ON subscribers;
CREATE POLICY "Users can update their own subscriber record" 
ON subscribers 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = auth_user_id OR auth.email() = email)
WITH CHECK (auth.uid() = auth_user_id OR auth.email() = email);

-- Ensure service role can do everything (for admin operations)
CREATE POLICY "Service role has full access" 
ON subscribers 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Verify the policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'subscribers'
ORDER BY policyname;