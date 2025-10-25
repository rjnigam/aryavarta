# Production Environment Variables Checklist

## ⚠️ CRITICAL: Set These in Vercel Dashboard

Before users can authenticate in production, verify these environment variables are set:

### 1. Go to Vercel Dashboard
- Navigate to: https://vercel.com/rjnigams-projects/aryavarta/settings/environment-variables

### 2. Required Environment Variables

#### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yrwkufkhusfwikyfaime.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (your service role key - KEEP SECRET)
```

#### Email Configuration (Resend)
```bash
RESEND_API_KEY=re_... (your Resend API key)
```

#### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://arya-varta.in
```

#### Moderation Dashboard (Optional but recommended)
```bash
MODERATION_DASHBOARD_USER=admin
MODERATION_DASHBOARD_PASSWORD=(strong password for /moderation access)
```

### 3. Cookie Settings for Production

The code is already configured with these settings:
- `secure: false` for localhost (development)
- For production, you may want to update these to `secure: true` in:
  - `/app/api/auth/login/route.ts`
  - `/app/api/auth/logout/route.ts`

However, since your site uses HTTPS (arya-varta.in), the cookies will be secure automatically.

### 4. Supabase Auth Redirect URLs

In your Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://arya-varta.in
```

**Redirect URLs (add both):**
```
https://arya-varta.in/auth/callback
https://www.arya-varta.in/auth/callback
```

### 5. Email Template Configuration

In Supabase Dashboard → Authentication → Email Templates:

Update the email confirmation template to use:
```
{{ .ConfirmationURL }}
```

This ensures verification links point to production URLs.

### 6. Resend Domain Configuration

In Resend Dashboard (https://resend.com):
- Verify `arya-varta.in` domain is added
- Configure SPF and DKIM records in your DNS
- Test email sending from production

### 7. Post-Deployment Testing

Test the following flows on https://arya-varta.in:

1. **Signup Flow**
   - [ ] Go to /auth/signup
   - [ ] Create new account
   - [ ] Receive verification email
   - [ ] Click verification link
   - [ ] Get redirected to homepage with welcome message

2. **Login Flow**
   - [ ] Go to /auth/login
   - [ ] Login with verified account
   - [ ] Session persists across page refreshes
   - [ ] Username is Sanskrit-based

3. **Logout Flow**
   - [ ] Click logout in header
   - [ ] Redirected to login page
   - [ ] Cookies cleared properly

4. **Account Switching**
   - [ ] Logout
   - [ ] Login with different account
   - [ ] No cache conflicts
   - [ ] New account data loads correctly

5. **Comment Posting**
   - [ ] Navigate to any article
   - [ ] Post a comment (requires login)
   - [ ] Comment appears immediately
   - [ ] Username displayed correctly

### 8. Monitoring

Monitor these after deployment:

- **Vercel Logs**: Check for any errors
- **Supabase Logs**: Monitor auth events
- **Resend Dashboard**: Track email delivery
- **Browser Console**: Check for any client-side errors

### 9. Known Issues to Watch

- Rate limiting: Supabase has 4 emails/hour limit per address
- First-time login may take slightly longer (subscriber record creation)
- If cookies aren't persisting, check HTTPS/SSL certificate

---

## Quick Commands

### Check Deployment Status
```bash
vercel ls --prod
```

### View Environment Variables
```bash
vercel env ls
```

### Pull Production Logs
```bash
vercel logs https://arya-varta.in --follow
```

### Redeploy if Needed
```bash
vercel --prod
```

---

**Last Updated:** October 25, 2025  
**Deployment:** ✅ Live on https://arya-varta.in
