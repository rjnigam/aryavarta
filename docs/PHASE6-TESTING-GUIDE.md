# Phase 6: Authentication Testing Guide

## 🧪 Manual Testing Checklist

### Prerequisites
- ✅ SQL migration run in Supabase
- ✅ Dev server running: `npm run dev`
- ✅ Environment variables set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- ✅ Supabase OAuth providers enabled (Google + Twitter) with client IDs/secrets

---

## Test 1: Sign Up Flow

1. **Navigate to Signup**
   - Go to: http://localhost:3000/auth/signup
   - Or click "Sign up" button in header

2. **Fill Out Form**
   - Name: Test User
   - Email: test@example.com (use your real email for verification)
   - Password: TestPassword123!
   - Confirm Password: TestPassword123!

3. **Submit Form**
   - ✅ Should see "Check Your Email" success message
   - ✅ Password strength indicator should show "Strong"
   - ✅ No console errors

4. **Check Email**
   - ✅ Receive confirmation email from Supabase
   - ✅ Click verification link
   - ✅ Redirected to home page

5. **Check Database**
   ```sql
   -- In Supabase SQL Editor:
   SELECT * FROM auth.users WHERE email = 'test@example.com';
   SELECT * FROM subscribers WHERE email = 'test@example.com';
   ```
   - ✅ User exists in auth.users
   - ✅ Subscriber record created with auth_user_id
   - ✅ Unique username generated

---

## Test 2: Login Flow

1. **Navigate to Login**
   - Go to: http://localhost:3000/auth/login
   - Or click "Sign in" button in header

2. **Enter Credentials**
   - Email: test@example.com
   - Password: TestPassword123!

3. **Submit Form**
   - ✅ Redirected to home page
   - ✅ User menu appears in header
   - ✅ Shows user's name and avatar
   - ✅ No console errors

4. **Check Session**
   - Open DevTools → Application → Cookies
   - ✅ Should see Supabase auth cookies

---

## Test 3: Password Reset Flow

### 3.1 Request Reset Email
1. Go to: http://localhost:3000/auth/reset-password
2. Enter the email address of an existing user and click "Send reset link"
3. ✅ See success message confirming a reset email was sent
4. ⏱️ Optional: Try an unknown email and confirm the UI still shows the generic success message (no info leak)

### 3.2 Complete Password Update
1. Open the reset email from Supabase and click the "Reset Password" link
2. ✅ The app should load the same `/auth/reset-password` page with "Set a new password" form
3. Enter a strong password that satisfies all checklist items and confirm it
4. Click "Save new password"
5. ✅ Success message shows and you are redirected to `/auth/login`
6. Attempt to log in with **old** password → should fail
7. Log in with the **new** password → should succeed

---

## Test 4: Social Login (Google & Twitter)

> **Pre-req**: In Supabase Dashboard → Authentication → Providers, enable Google and Twitter, and provide client ID/secret. Twitter requires Elevated access on the developer portal.

1. Visit http://localhost:3000/auth/login
2. Click **Continue with Google**
   - Approve the OAuth consent screen (use a test Google account)
   - ✅ Redirect back to site with user menu showing Google account name
3. Sign out via header dropdown
4. Repeat with **Continue with Twitter** (requires active Twitter developer app)
5. ✅ After returning, user menu shows Twitter display name/username
6. In Supabase SQL Editor, confirm a `subscribers` record exists for each social account (trigger should run automatically)
7. Optional: Check `/api/auth/session` returns subscriber profile linked to the provider account

> ℹ️ Instagram and Reddit are **not** currently supported by Supabase OAuth. Supporting them would require a custom OAuth proxy or third-party auth service.

---

## Test 5: User Menu

1. **Click User Avatar** (top right)
   - ✅ Dropdown opens
   - ✅ Shows name, username, email
   - ✅ Shows Profile, Settings, My Comments links
   - ✅ Shows Sign out button

2. **Test Navigation**
   - Click "Profile" → Should go to /profile (will 404 for now, that's okay)
   - Go back
   - Click avatar again

3. **Test Sign Out**
   - Click "Sign out"
   - ✅ User menu disappears
   - ✅ "Sign in" and "Sign up" buttons appear
   - ✅ Redirected to home

---

## Test 6: Session Persistence

1. **Sign in** (if not already)

2. **Refresh the page**
   - ✅ User stays logged in
   - ✅ User menu still shows

3. **Open new tab** to same site
   - ✅ User is logged in there too

4. **Close browser completely**

5. **Reopen and go to site**
   - ✅ User should still be logged in (session persists)

---

## Test 7: Error Handling

### Invalid Email
1. Go to signup
2. Enter email: "notanemail"
3. Try to submit
   - ✅ Browser validation shows error

### Password Too Short
1. Go to signup
2. Enter password: "123"
3. ✅ Password strength shows "Too short"
4. ✅ Form validation prevents submit

### Missing Password Complexity
1. Go to signup
2. Enter password: "password123" (no uppercase or special characters)
3. ✅ Requirement checklist highlights missing items
4. ✅ Submit button remains disabled until all requirements met

### Password Mismatch
1. Go to signup
2. Password: "TestPassword123!"
3. Confirm: "DifferentPassword123!"
4. ✅ Shows "Passwords do not match" error

### Wrong Login Credentials
1. Go to login
2. Enter wrong password
3. ✅ Shows error message "Invalid login credentials"
4. ✅ Doesn't expose whether email exists (security)

### Email Already Exists
1. Try to sign up with same email again
2. ✅ Shows "User already registered"

---

## Test 8: Email Verification Flow

### Unverified User Login
1. Sign up with new email
2. DON'T click verification link
3. Try to log in
4. **Expected**: May get error about unconfirmed email
   - Supabase default: blocks unverified logins
   - Can be configured in Supabase → Authentication → Email Auth

### Click Verification Link
1. Check email for verification link
2. Click link
3. ✅ Redirected to site
4. ✅ email_verified = true in database
5. ✅ Can now log in

---

## Test 9: Protected Routes (Future)

**NOTE**: These will pass once comment/reaction endpoints are migrated to session-based auth (Phase 6 follow-up).

1. Attempt to post a comment while logged out — should be blocked with a prompt to sign in
2. Try reacting to a comment without a session — should be prevented or redirect to login

Track failures now so we can confirm they flip to ✅ after middleware work.

---

## 🐛 Known Issues to Watch For

### Issue 1: Username Not Unique
- **Symptom**: Signup fails with unique constraint error
- **Cause**: Sanskrit username pool collision
- **Fix**: Already handled in signup API with retry logic

### Issue 2: Subscriber Not Created
- **Symptom**: Login succeeds but no subscriber profile
- **Cause**: Trigger didn't fire
- **Debug**:
  ```sql
  SELECT * FROM auth.users WHERE email = 'test@example.com';
  SELECT * FROM subscribers WHERE auth_user_id = '<user_id_from_above>';
  ```
- **Fix**: Manually create subscriber or re-run migration

### Issue 3: Session Not Persisting
- **Symptom**: User logged out on refresh
- **Cause**: Cookie not being set
- **Debug**: Check browser DevTools → Application → Cookies
- **Fix**: Ensure NEXT_PUBLIC_SUPABASE_URL is correct

### Issue 4: CORS Errors
- **Symptom**: Console shows CORS errors when calling Supabase
- **Cause**: Supabase URL configured incorrectly
- **Fix**: Verify .env.local has correct Supabase URL

---

## ✅ Success Criteria

All of these should pass:

- [ ] Can create new account with password
- [ ] Receive verification email
- [ ] Can verify email via link
- [ ] Can log in with verified account
- [ ] User menu shows correct name/username
- [ ] Session persists across page reloads
- [ ] Can log out successfully
- [ ] Cannot log in with wrong password
- [ ] Cannot create duplicate account with same email
- [ ] Password strength indicator works
- [ ] Password policy blocks weak passwords (must meet all requirements)
- [ ] Form validation prevents bad inputs
- [ ] Password reset flow works end-to-end (email + new password)
- [ ] Social login (Google & Twitter) returns authenticated session
- [ ] No console errors during any flow

---

## 🔍 Debugging Commands

### Check User in Database
```sql
-- In Supabase SQL Editor
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  s.username,
  s.name,
  s.is_active,
  s.email_verified
FROM auth.users u
LEFT JOIN subscribers s ON s.auth_user_id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE';
```

### Check Session API
```bash
# In terminal (while logged in)
curl -b cookies.txt http://localhost:3000/api/auth/session
```

### Clear All Auth State
```javascript
// In browser console
localStorage.clear();
// Then hard refresh
```

### Check Trigger Fired
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## ⚙️ Social Provider Setup Quick Reference

1. **Enable Providers**: Supabase Dashboard → Authentication → Providers → toggle **Google** & **Twitter**.
2. **Google**:
   - Create OAuth credentials in Google Cloud Console → Web Application
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy client ID/secret into Supabase provider settings.
3. **Twitter**:
   - Twitter Developer Portal → Project/App → User authentication settings
   - Callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Requires Elevated access to enable email scope.
4. **Local Testing**: No extra env vars needed; Supabase handles redirect to `/auth/callback` in this app.
5. **Production**: Ensure provider credentials exist in every Supabase environment (dev/prod) before deployment.

---

## 📸 Screenshots to Take (Optional)

For documentation:
1. Signup page with password strength indicator
2. Email confirmation success screen
3. Login page
4. User menu dropdown
5. Logged-in header with user avatar

---

## Next Steps After Testing

Once all tests pass:

1. Implement route-level guards + middleware (Phase 6 Step 5)
2. Migrate comment/reaction APIs to session-based auth (Phase 6 Step 6)
3. Document Supabase provider configuration in `ENV_SETUP.md`
4. Plan future social sharing integrations once auth rollout is complete

---

**Last Updated**: Just now  
**Testing Started**: When you clicked the first link  
**Issues Found**: (Add here as you test)
