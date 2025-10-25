# Phase 6: Password-Based Authentication Implementation

## Status: ⚠️ IN PROGRESS (Step 6 of 7)

## Overview
This document tracks the implementation of secure password-based authentication for Aryavarta, replacing the previous email-only system with proper password protection using Supabase Auth.

---

## ✅ Completed Steps

### 1. ✅ Audit Current Auth Flow
**Status**: Complete

**Findings**:
- Current system uses email + username validation against `subscribers` table
- No password protection - anyone can enter any email to "log in"
- Comments, reactions, and reports verify email/username pairs
- Need to integrate Supabase Auth while maintaining existing `subscribers` table

### 2. ✅ Design Auth Schema  
**Status**: Complete

**Created**: `docs/PHASE6-AUTH-MIGRATION.sql`

**Key Changes**:
- Added `auth_user_id` column to `subscribers` table (links to Supabase auth.users)
- Added `email_verified`, `created_at`, `updated_at` columns
- Created trigger functions to auto-create subscriber records on auth signup
- Implemented Row Level Security (RLS) policies
- Email verification sync between auth.users and subscribers

**Migration Required**: ⚠️ **YOU MUST RUN THIS SQL IN SUPABASE BEFORE TESTING**

```bash
# Go to: Supabase Dashboard → SQL Editor → New Query
# Copy and paste contents of: docs/PHASE6-AUTH-MIGRATION.sql
# Click "RUN"
```

### 3. ✅ Implement Signup/Login APIs
**Status**: Complete

**Files Created/Updated**:
- ✅ `/app/api/auth/signup/route.ts` - Password-based signup
- ✅ `/app/api/auth/login/route.ts` - Password-based login (UPDATED from email-only)
- ✅ `/app/api/auth/logout/route.ts` - Session termination
- ✅ `/app/api/auth/session/route.ts` - Get current user session
- ✅ `/app/auth/callback/route.ts` - Email verification callback handler
- ✅ `/lib/supabaseAuth.ts` - Client-side auth helpers
- ✅ `/lib/usernameGenerator.ts` - Shared Sanskrit username allocator for signup + newsletter

**Package Installed**:
```bash
npm install @supabase/ssr  # ✅ Already installed
```

**API Endpoints**:
- `POST /api/auth/signup` - Create new account (email, password, name)
- `POST /api/auth/login` - Log in (email, password)
- `POST /api/auth/logout` - Log out current user
- `GET /api/auth/session` - Get current session
- `GET /auth/callback` - Handle email verification

### 4. ✅ Enforce Strong Password Policy
**Status**: Complete

**Highlights**:
- Introduced shared password policy utilities in `lib/passwordPolicy.ts`
- Server-side validation ensures length, uppercase, lowercase, number, and special character
- Signup UI now displays real-time requirement checklist and strength meter tied to policy
- Password requirements reused on reset-password page to keep parity

### 5. ✅ Forgot Password Flow
**Status**: Complete

**Files Created**:
- ✅ `/app/auth/reset-password/page.tsx` - Request reset email and set new password

**Features**:
- Email-based reset request with success/error feedback
- Recovery link detection via Supabase hash to show new password form
- Shared password strength indicator for new password entry
- Automatic redirect to login after successful update

### 6. ✅ Social Login (Google & Twitter)
**Status**: Complete

**Highlights**:
- Added `signInWithProvider` helper in `lib/supabaseAuth.ts`
- Login page now includes "Continue with Google" and "Continue with Twitter" buttons
- OAuth callback handled via existing `/auth/callback` route
- Documented provider configuration requirements in Testing Guide (see below)

---

## 🚧 In Progress

Current focus:
- 🔄 Protect app surfaces with auth middleware/guards (see Step 5 below)
- 🔄 Migrate comments/reactions to use authenticated sessions (see Step 6 below)
- 🔄 Comprehensive testing & documentation (Step 7)

---

## ⏳ Pending Steps

### 5. ⏳ Add Auth Middleware/Guards
**Status**: NOT STARTED  
**Priority**: HIGH

**Required**:
- [ ] Update middleware.ts to check auth status for protected routes
- [ ] Add session validation for commenting/reactions
- [ ] Redirect unauthenticated users to login
- [ ] Handle session expiry gracefully

### 6. ⏳ Update Existing Features
**Status**: NOT STARTED  
**Priority**: CRITICAL

**Files to Update**:
- [ ] `/app/api/comments/[slug]/route.ts` - Validate auth instead of email/username
- [ ] `/app/api/comments/reactions/route.ts` - Use auth session
- [ ] `/app/api/comments/report/route.ts` - Use auth session
- [ ] Comment submission forms - Use session data
- [ ] Any other email/username validation points

### 7. ⏳ Test and Document
**Status**: NOT STARTED  
**Priority**: HIGH

**Required**:
- [ ] Run ESLint
- [ ] Test signup flow end-to-end
- [ ] Test login flow
- [ ] Test password reset
- [ ] Test comment posting with auth
- [ ] Update ENV_SETUP.md with Supabase Auth settings
- [ ] Update deployment guides
- [ ] Create user documentation

---

## 🎯 Next Immediate Steps

### Step 1: Protect Auth-Required Routes
- Implement middleware/guards to enforce auth on comment/reaction APIs
- Redirect anonymous users attempting to comment to `/auth/login?redirect=...`

### Step 2: Migrate Comments & Reactions
- Update API handlers to trust Supabase sessions instead of raw email/username payloads
- Update UI forms to pull name/email from `useAuth()` context

### Step 3: Comprehensive Testing & Docs
- Run through PHASE6-TESTING-GUIDE (including password reset & social login)
- Update `ENV_SETUP.md` with provider configuration notes
- Capture screenshots for release notes

---

## 📋 Testing Checklist

Before deploying to production:

- [ ] SQL migration runs without errors
- [ ] Can create new account via signup page
- [ ] Receive confirmation email
- [ ] Can verify email via link
- [ ] Can log in with correct password
- [ ] Cannot log in with wrong password
- [ ] Session persists across page reloads
- [ ] Can log out successfully
- [ ] Can reset forgotten password
- [ ] Social login (Google/Twitter) completes and returns session
- [ ] Comments require authentication
- [ ] Reactions require authentication
- [ ] Old email-only auth no longer works

---

## 🔒 Security Considerations

### Implemented:
- ✅ Password hashing handled by Supabase Auth
- ✅ Email verification required
- ✅ Session tokens in HTTP-only cookies
- ✅ Row Level Security policies
- ✅ Strong password policy (length, upper/lowercase, number, special character)
- ✅ Email format validation
- ✅ Dedicated password reset flow with Supabase recovery links

### To Implement:
- [ ] Rate limiting on login attempts
- [ ] CAPTCHA on signup (optional)
- [ ] Account lockout after failed attempts
- [ ] Security headers in middleware

---

## 🐛 Known Issues

1. **Old Subscribers Migration**: Existing subscribers from the email-only system don't have passwords. They need to:
   - Use "Sign Up" with their existing email
   - Or implement a "Claim Account" flow with email verification

2. **Username Generation**: The SQL trigger uses a simple `user_[id]` format. The full Sanskrit username pool logic needs to be called from the signup API (already implemented).

3. **Email Sending**: Welcome emails currently sent via Resend. May need to switch to Supabase email templates for consistency.

4. **Social Providers Coverage**: Supabase OAuth currently supports Google, Twitter, GitHub, etc., but **not** Instagram or Reddit. Adding those would require a custom OAuth broker or third-party integration.

---

## 📚 Documentation References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js App Router Auth](https://nextjs.org/docs/app/building-your-application/authentication)

---

## 🚀 Deployment Notes

### Environment Variables (No new ones required!)
All existing Supabase variables work with Auth:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅  
- `SUPABASE_SERVICE_ROLE_KEY` ✅

### Vercel Deployment Steps
1. Run SQL migration in Supabase (BEFORE deploying code)
2. Push code to git
3. Vercel auto-deploys
4. Test signup/login on production

---

**Last Updated**: October 24, 2025  
**Current Phase**: 6 of 7 (auth guards & testing remaining)  
**Blocking Issue**: Auth middleware + comment session migration pending  
**Next Action**: Implement route protection and migrate comment/reaction flows to sessions
