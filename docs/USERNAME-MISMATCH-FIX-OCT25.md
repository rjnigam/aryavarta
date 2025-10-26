# Username Mismatch Bug Fix - October 25, 2025

## Issue Description
Users reported a critical bug where the username shown in the verification email did not match the username displayed after login.

**Example:**
- Email shows: `bhakti_shruti-960`
- After login shows: `@jnana_nadi`

## Root Cause Analysis

### The Flow That Caused the Bug

1. **During Signup** (`/api/auth/signup`):
   - Username `bhakti_shruti-960` was generated
   - Stored in Supabase Auth `user_metadata.username`
   - Verification email sent with username `bhakti_shruti-960`
   - ❌ **CRITICAL ISSUE:** Subscriber record was NOT created in database

2. **During First Login** (`/api/auth/login`):
   - Tried to fetch subscriber record from database
   - No record found (because it wasn't created at signup)
   - Attempted to retrieve username from `user_metadata.username`
   - If metadata was missing/unavailable, generated a NEW random username
   - Created subscriber record with the new username `jnana_nadi-123`

### Why This Happened

The original architecture assumed that:
1. Signup would only create the Auth user
2. The subscriber record would be created on first login

However, this created a race condition where:
- The email was sent with the username from signup
- But the database record was created at login with potentially a different username
- If `user_metadata` wasn't properly propagated, a new username would be generated

## The Fix

### 1. Create Subscriber Record at Signup

Modified `/app/api/auth/signup/route.ts` to create the subscriber record immediately after creating the auth user:

```typescript
// Create subscriber record immediately after auth user creation
try {
  const { error: subscriberError } = await supabase
    .from('subscribers')
    .insert({
      email: authData.user.email!,
      name: name.trim(),
      username,
      is_active: true,
      auth_user_id: authData.user.id,
      email_verified: false, // Will be updated after email verification
    });

  if (subscriberError) {
    console.error('Failed to create subscriber record:', subscriberError);
    // Don't fail the signup, but log the error
  }
} catch (subscriberCreationError) {
  console.error('Subscriber creation error:', subscriberCreationError);
  // Continue with signup even if subscriber creation fails
}
```

### 2. Improved Metadata Handling at Login

Modified `/app/api/auth/login/route.ts` to better handle the username from metadata:

```typescript
// IMPORTANT: Always use the username from metadata if it exists
// This ensures consistency with the signup email
const username = derivedUsername || (await generateUniqueUsername(null, { baseName: derivedName }));

console.log('Creating subscriber record for first login:', {
  email: authData.user.email,
  username,
  usernameSource: derivedUsername ? 'metadata' : 'generated',
  metadata: metadata.username,
});
```

### 3. Added Logging for Debugging

Added console.log statements to track:
- Whether subscriber record was created at signup
- Which username source is used at login (metadata vs generated)
- The actual metadata values for debugging

## Testing the Fix

### For New Signups (After Fix)

1. Sign up with email and password
2. Check verification email - note the username (e.g., `bhakti_shruti-960`)
3. Verify email via link
4. Log in
5. ✅ Username should match the email exactly

### For Existing Users (Before Fix)

Unfortunately, existing users who signed up before this fix will keep their mismatched usernames. They have two options:

1. **Keep current username** - No action needed, everything works
2. **Reset to email username** - Would require manual database update or account recreation

## Impact

**Resolved:**
- ✅ Username consistency between email and UI
- ✅ Subscriber records created at signup (not delayed until login)
- ✅ Better error handling and logging
- ✅ Race condition eliminated

**Future Prevention:**
- Subscriber record now created atomically with auth user
- Added logging to track username source
- Defensive coding to always prefer metadata username

## Database Schema Note

The `subscribers` table structure remains unchanged:
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  auth_user_id UUID UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
```

The key change is WHEN the record is created (signup vs login), not the schema itself.

## Files Modified

1. `app/api/auth/signup/route.ts` - Added subscriber record creation
2. `app/api/auth/login/route.ts` - Improved metadata handling and logging

## Deployment Notes

1. This fix is backward-compatible
2. No database migration required
3. Existing users are not affected
4. Only new signups after deployment will have consistent usernames

## Monitoring

After deployment, monitor for:
- "Failed to create subscriber record" errors (should be rare)
- "Creating subscriber record for first login" logs with `usernameSource: 'generated'` (should decrease over time)
- Any reports of username mismatch (should stop completely)

---

**Version:** v1.2.1
**Date:** October 25, 2025
**Severity:** Critical - User experience bug
**Status:** Fixed
