# Email Verification Troubleshooting Guide

## 🚨 Current Issue: Verification Emails Not Being Sent

**Last Updated**: October 25, 2025  
**Status**: Critical - Blocking user signups

## Problem Summary
Users are completing the signup form but not receiving verification emails. This has been happening since yesterday.

## Root Cause Analysis

Based on diagnostic results:
1. **Invalid Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` is returning "Invalid API key" error
2. This prevents both Supabase's built-in email system AND the Resend fallback from working

## Immediate Fix Steps

### 1. Get Fresh Supabase Keys
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `yrwkufkhusfwikyfaime`
3. Navigate to **Settings → API**
4. Copy both keys:
   - **anon (public) key**: Starts with `eyJhbGc...` 
   - **service_role (secret) key**: Also starts with `eyJhbGc...` but different

### 2. Update Your `.env.local`
```bash
# Replace these with your fresh keys
NEXT_PUBLIC_SUPABASE_URL=https://yrwkufkhusfwikyfaime.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_fresh_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_fresh_service_role_key_here
```

### 3. Verify Supabase Email Settings
1. In Supabase Dashboard → **Authentication → Email Templates**
2. Ensure these settings:
   - ✅ **Enable email confirmations**: ON
   - ✅ **Confirm email template**: Active
   - ✅ **Double check SMTP settings** (if using custom SMTP)

### 4. Check Email Provider Settings
1. In Supabase Dashboard → **Authentication → Providers → Email**
2. Verify:
   - **Enable Email provider**: ON
   - **Confirm email**: ON (required)
   - **Email rate limit**: Default is 4 emails/hour per address

## Testing After Fix

### Quick Test Script
```bash
# After updating .env.local, run:
node scripts/diagnose-email-issue.js

# Should see:
# ✅ Admin API is accessible (not "Invalid API key")
```

### Manual Test Flow
1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/auth/signup
3. Sign up with a real email you control
4. Check:
   - Primary inbox
   - Spam/Junk folder
   - Promotions tab (Gmail)

## Alternative Solutions

### Option 1: Disable Email Confirmation (Temporary)
In Supabase Dashboard → Authentication → Email:
- Set **Confirm email** to OFF
- Users can sign up and log in immediately
- ⚠️ Security risk - only for testing

### Option 2: Manual User Confirmation
1. Go to Supabase Dashboard → Authentication → Users
2. Find the unconfirmed user
3. Click the three dots → **Confirm email**
4. User can now log in

### Option 3: Use Supabase's Built-in SMTP
Instead of Resend, use Supabase's email service:
1. Remove custom SMTP settings
2. Rely on Supabase's default email sender
3. Note: Emails come from `noreply@mail.app.supabase.io`

## Email Delivery Checklist

When emails aren't arriving:

1. **Check Supabase Logs**
   - Dashboard → Logs → Filter by `auth.signup`
   - Look for email sending errors

2. **Check Resend Dashboard**
   - Log into [Resend](https://resend.com)
   - Check Emails → Activity
   - Look for bounces or failures

3. **Common Email Blocks**
   - Corporate email filters
   - Disposable email addresses
   - Rate limiting (4 emails/hour default)
   - SPF/DKIM not configured for custom domain

## Production Deployment Notes

Before deploying to production:
1. Set `NEXT_PUBLIC_SITE_URL` to production URL
2. Update Supabase email redirect URLs
3. Configure SPF/DKIM for `arya-varta.in` domain
4. Set production environment variables in Vercel

## Still Not Working?

If emails still aren't sending after these steps:

1. **Check Rate Limits**: Wait 1 hour and try again
2. **Try Different Email**: Use Gmail instead of work email
3. **Check Supabase Status**: https://status.supabase.com
4. **Contact Support**: 
   - Supabase Discord/Support
   - Create GitHub issue with diagnostic output

## Related Files
- `/app/api/auth/signup/route.ts` - Signup endpoint
- `/lib/email/sendVerificationEmail.ts` - Resend fallback logic
- `/scripts/diagnose-email-issue.js` - Diagnostic tool
- `.env.local` - Environment configuration

---

**Remember**: The service role key is SECRET. Never commit it to Git or share publicly!