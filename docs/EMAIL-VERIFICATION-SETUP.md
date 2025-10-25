# Email Verification Setup Guide

## Problem
Users are signing up but:
1. Not receiving confirmation emails
2. Email verification status not updating after clicking the link

## Solutions

### Option 1: Disable Email Confirmation (For Testing Only)

**Supabase Dashboard Steps:**
1. Go to **Authentication** → **Providers** → **Email**
2. Scroll to **"Confirm email"**
3. **Toggle OFF** "Confirm email" 
4. Click **Save**

⚠️ **Warning**: This allows users to sign up without verifying their email. Only use for development/testing!

---

### Option 2: Enable Email Confirmation with Supabase SMTP (Recommended for Development)

Supabase provides free email sending for development:

1. Go to **Authentication** → **Providers** → **Email**
2. Ensure **"Confirm email"** is **ON**
3. Go to **Authentication** → **Email Templates** → **Confirm signup**
4. Verify the template looks correct
5. Ensure the redirect URL includes: `{{ .ConfirmationURL }}`

**Default Template Should Include:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Check Email Logs:**
- Go to **Logs** → **Auth Logs** to see if emails are being sent
- Filter by "email" to see confirmation emails

---

### Option 3: Use Custom SMTP (Production)

For production, configure your own email service:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Configure with your email provider (SendGrid, Resend, etc.)

**Example with Resend:**
- **Host**: `smtp.resend.com`
- **Port**: `587` 
- **Username**: `resend`
- **Password**: Your Resend API key
- **Sender email**: `noreply@arya-varta.in`

---

## Verification After Setup

### Test Email Sending:
1. Sign up with a test email you can access
2. Check **Logs** → **Auth Logs** in Supabase dashboard
3. Look for "email sent" events

### Test Callback Handler:
1. After clicking the email link, you should be redirected to `/`
2. Check the **subscribers** table - `email_verified` should be `true`
3. User should be automatically logged in

---

## Troubleshooting

### Emails Not Being Sent
- ✅ Check Auth Logs in Supabase for errors
- ✅ Verify email provider quotas (Supabase free tier has limits)
- ✅ Check spam folder
- ✅ Ensure `emailRedirectTo` URL is in Supabase's allowed redirect URLs

### Email Verified Status Not Updating
- ✅ Callback route updated (includes subscriber table update)
- ✅ User has clicked the confirmation link
- ✅ Check browser DevTools network tab for callback errors
- ✅ Verify subscriber record exists with matching email

### Redirect URL Issues
**Add to Supabase Redirect Allow List:**
1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://arya-varta.in/auth/callback`
   - `https://www.arya-varta.in/auth/callback`

---

## Current Implementation

✅ **Callback Handler**: `/app/auth/callback/route.ts`
- Exchanges code for session
- Updates `email_verified` in subscribers table
- Redirects to homepage

✅ **Signup Flow**: 
- Creates Supabase Auth user with `emailRedirectTo`
- Sends confirmation email (if enabled)
- Creates subscriber record
- Waits for email confirmation

✅ **Session Handling**:
- AuthContext loads user and subscriber profile
- Homepage shows personalized content for verified users
- Sanskrit username displayed in user menu

---

## Recommended Development Setup

**For fastest testing** (disable email verification temporarily):
```sql
-- In Supabase SQL Editor, manually verify users:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-test-email@example.com';

UPDATE subscribers 
SET email_verified = true 
WHERE email = 'your-test-email@example.com';
```

**Then re-enable email confirmation** before production deployment.
