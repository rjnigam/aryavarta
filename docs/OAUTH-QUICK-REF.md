# OAuth Setup - Quick Reference

**Date:** October 26, 2025  
**Status:** Code Ready - Providers Need Configuration

---

## What Was Done

### ✅ Code Changes Complete
1. **Updated auth callback handler** (`app/auth/callback/route.ts`)
   - Creates subscriber profiles for OAuth users automatically
   - Generates unique usernames
   - Sets email_verified to true
   - Prevents duplicate subscriber creation

2. **Added OAuth to signup page** (`app/auth/signup/page.tsx`)
   - Google sign-up button
   - Twitter sign-up button
   - Matches login page design
   - Proper loading states

3. **Login page** (already had OAuth buttons)
   - No changes needed
   - Already has Google and Twitter buttons

---

## What You Need to Do

### Step 1: Configure Google OAuth (15 minutes)
1. Go to https://console.cloud.google.com/
2. Create OAuth credentials
3. Set redirect URI: `https://yrwkufkhusfwikyfaime.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. Add to Supabase Dashboard → Authentication → Providers → Google

### Step 2: Configure Twitter OAuth (15 minutes)
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create OAuth 2.0 credentials
3. Set callback URI: `https://yrwkufkhusfwikyfaime.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. Add to Supabase Dashboard → Authentication → Providers → Twitter

### Step 3: Deploy to Production
```bash
cd /Users/rajathnigam/Gurukul

# Review changes
git status
git diff app/auth/callback/route.ts
git diff app/auth/signup/page.tsx

# Commit
git add .
git commit -m "feat: Enable Google and Twitter OAuth sign-in

- Updated auth callback to create subscriber profiles for OAuth users
- Added OAuth buttons to signup page (already on login)
- Automatic username generation for OAuth users
- email_verified automatically set to true for OAuth
- Prevents duplicate subscriber creation"

# Push
git push origin main
```

### Step 4: Test (after Vercel deployment)
1. Go to https://arya-varta.in/auth/login
2. Click "Continue with Google" - verify it works end-to-end
3. Click "Continue with Twitter" - verify it works end-to-end
4. Check Supabase → subscribers table for new records
5. Verify no duplicates if signing in again

---

## Files Changed

```
Modified:
  app/auth/callback/route.ts       (+50 lines)  - OAuth subscriber creation
  app/auth/signup/page.tsx         (+38 lines)  - OAuth buttons added
  
Created:
  docs/OAUTH-SETUP-GUIDE.md        (443 lines)  - Complete setup guide
  docs/OAUTH-QUICK-REF.md          (this file)  - Quick reference
```

---

## How It Works

### User Flow
```
1. User clicks "Sign up with Google" on /auth/signup or /auth/login
2. Redirected to Google for authentication
3. User authorizes Aryavarta
4. Google redirects to: /auth/callback?code=...
5. Callback exchanges code for session
6. Callback checks if subscriber exists
7. If not, creates subscriber with:
   - email from Google
   - name from Google
   - generated username
   - auth_user_id linked
   - email_verified = true
8. Redirects user to homepage (logged in)
```

### Subsequent Sign-Ins
- User clicks "Sign in with Google"
- Callback checks subscriber exists
- Just logs them in (no duplicate creation)
- Redirects to homepage

---

## Testing Checklist

After configuring providers and deploying:

### Google OAuth
- [ ] Sign up with Google works
- [ ] Subscriber record created
- [ ] Username generated
- [ ] email_verified = true
- [ ] Can comment on articles
- [ ] Sign out and sign in again works (no duplicate)

### Twitter OAuth
- [ ] Sign up with Twitter works
- [ ] Subscriber record created
- [ ] Username generated
- [ ] email_verified = true
- [ ] Can comment on articles
- [ ] Sign out and sign in again works (no duplicate)

### Edge Cases
- [ ] Try to create email account with same email as OAuth (should fail gracefully)
- [ ] OAuth on mobile browser works
- [ ] Error messages clear and helpful

---

## Troubleshooting

**Problem:** "OAuth provider not configured"  
**Solution:** Enable provider in Supabase Dashboard

**Problem:** "Redirect URI mismatch"  
**Solution:** Verify callback URL matches exactly in Google/Twitter console

**Problem:** OAuth succeeds but can't comment  
**Solution:** Check if subscriber record was created, check for RLS policy issues

**Problem:** Duplicate subscribers created  
**Solution:** Check callback logic, may be race condition

---

## Next Steps After OAuth is Live

1. **Monitor for 24 hours**
   - Check Supabase logs for errors
   - Watch for duplicate subscriber issues
   - Track OAuth adoption rate

2. **Analytics**
   - How many users choose OAuth vs email?
   - Which provider is more popular?
   - Does OAuth increase conversion?

3. **Future Enhancements**
   - Account linking (link Google to existing email account)
   - Profile photo from OAuth provider
   - Additional providers (GitHub, Apple)

---

## Support

**For detailed setup:** See `docs/OAUTH-SETUP-GUIDE.md`  
**For configuration:** Check provider documentation  
**For debugging:** Check Supabase logs and browser console

---

**Ready?** Configure providers in Supabase, then commit and deploy!
