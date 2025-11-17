# OAuth Sign-In Setup Guide (Google & Twitter)

**Date:** October 26, 2025  
**Status:** Ready to Implement

---

## Overview

Enable Google and Twitter OAuth sign-in for Aryavarta. Your code already has OAuth UI and logic - you just need to configure the providers in Supabase and update the callback handler.

---

## Part 1: Configure Google OAuth

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted:
   - **User Type:** External
   - **App name:** Aryavarta
   - **Support email:** Your email
   - **Authorized domains:** `arya-varta.in` and `supabase.co`
   - **Scopes:** email, profile, openid

6. Create OAuth Client ID:
   - **Application type:** Web application
   - **Name:** Aryavarta Production
   - **Authorized JavaScript origins:**
     ```
     https://arya-varta.in
     https://yrwkufkhusfwikyfaime.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://yrwkufkhusfwikyfaime.supabase.co/auth/v1/callback
     ```

7. Save and copy:
   - **Client ID**
   - **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/project/yrwkufkhusfwikyfaime)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Enable Google provider
5. Paste your **Client ID**
6. Paste your **Client Secret**
7. Click **Save**

---

## Part 2: Configure Twitter/X OAuth

### Step 1: Create Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or select existing:
   - **App name:** Aryavarta
   - **Use case:** User authentication
   
3. Go to app **Settings** → **User authentication settings**
4. Click **Set up**
5. Configure OAuth 2.0:
   - **App permissions:** Read
   - **Type of App:** Web App
   - **Callback URI:**
     ```
     https://yrwkufkhusfwikyfaime.supabase.co/auth/v1/callback
     ```
   - **Website URL:** `https://arya-varta.in`
   
6. Save and copy:
   - **Client ID**
   - **Client Secret**

### Step 2: Configure in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Twitter** and click to expand
3. Enable Twitter provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

---

## Part 3: Update Auth Callback Handler

The callback handler needs to create subscriber profiles for OAuth users who don't have one yet.

**File:** `app/auth/callback/route.ts`

Replace the entire file with:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Auth callback handler for email verification, password resets, and OAuth
 * This route processes OAuth callbacks and email confirmation links
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const type = requestUrl.searchParams.get('type');
  
  console.log('[Auth Callback] Processing callback:', {
    code: code ? 'present' : 'missing',
    next,
    type,
  });

  if (code) {
    const response = new NextResponse();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Exchange code error:', error);
      // Redirect to login with error message
      const errorUrl = new URL('/auth/login', request.url);
      errorUrl.searchParams.set('error', 'verification-failed');
      return NextResponse.redirect(errorUrl);
    }
    
    console.log('[Auth Callback] Code exchanged successfully:', {
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      provider: data?.user?.app_metadata?.provider,
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if subscriber profile exists
      const { data: existingSubscriber } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', user.email!)
        .maybeSingle();

      if (!existingSubscriber) {
        // Create subscriber profile for OAuth user
        console.log('[Auth Callback] Creating subscriber profile for OAuth user');
        
        // Get or generate username
        const { generateUniqueUsername } = await import('@/lib/usernameGenerator');
        const name = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'user';
        
        const username = await generateUniqueUsername(supabase, { baseName: name });

        try {
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
              email: user.email!,
              name: name,
              username: username,
              is_active: true,
              auth_user_id: user.id,
              email_verified: user.email_confirmed_at ? true : false,
            });

          if (insertError) {
            console.error('[Auth Callback] Failed to create subscriber:', insertError);
          } else {
            console.log('[Auth Callback] Subscriber profile created successfully');
          }
        } catch (err) {
          console.error('[Auth Callback] Subscriber creation error:', err);
        }
      } else if (user.email_confirmed_at) {
        // Update email_verified for existing users
        await supabase
          .from('subscribers')
          .update({ email_verified: true })
          .eq('email', user.email!);
      }
    }

    // Determine where to redirect after successful verification
    let redirectUrl: URL;
    if (type === 'signup' && user?.email_confirmed_at) {
      // After signup verification, redirect to home page with welcome message
      redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('welcome', 'true');
    } else if (data?.user?.app_metadata?.provider) {
      // OAuth sign-in, redirect to home
      redirectUrl = new URL('/', request.url);
    } else {
      // For other callbacks (password reset, etc.) use the next parameter
      redirectUrl = new URL(next, request.url);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // No code present, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
```

---

## Part 4: Add OAuth to Signup Page

Currently OAuth buttons are only on login page. Let's add them to signup too.

**File:** `app/auth/signup/page.tsx`

Find the form opening tag (around line 90) and add OAuth buttons right after it, before the name input field:

```typescript
<form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg border border-saffron-200">
  {/* NEW: Add OAuth buttons here */}
  {!success && (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => signInWithProvider('google')}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider('twitter')}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with Twitter
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs uppercase tracking-wider text-gray-400">Or sign up with email</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
    </>
  )}

  {/* Existing error display */}
  {error && (
    // ... rest of existing code
```

Also add the import at the top of the file:

```typescript
import { signUp, signInWithProvider } from '@/lib/supabaseAuth';
```

---

## Part 5: Test the OAuth Flow

### Testing Checklist

**Google Sign-In Test:**
1. [ ] Go to https://arya-varta.in/auth/login
2. [ ] Click "Continue with Google"
3. [ ] Select Google account
4. [ ] Verify redirect back to Aryavarta
5. [ ] Check you're logged in (UserMenu shows profile)
6. [ ] Go to Supabase → Table Editor → subscribers
7. [ ] Verify new subscriber record created with:
   - ✅ email from Google
   - ✅ auth_user_id populated
   - ✅ email_verified = true
   - ✅ username generated

**Twitter Sign-In Test:**
1. [ ] Go to https://arya-varta.in/auth/login
2. [ ] Click "Continue with Twitter"
3. [ ] Authorize Aryavarta app
4. [ ] Verify redirect back
5. [ ] Check logged in
6. [ ] Verify subscriber record created

**Edge Cases:**
- [ ] Sign in with Google, then try to create email account with same email (should fail gracefully)
- [ ] Sign out and sign in again with same OAuth account (should not create duplicate subscriber)
- [ ] Test on mobile browser

---

## Part 6: Deploy to Production

### Step 1: Update Auth Callback

```bash
cd /Users/rajathnigam/Gurukul
# Edit app/auth/callback/route.ts with new code
```

### Step 2: Update Signup Page

```bash
# Edit app/auth/signup/page.tsx to add OAuth buttons
```

### Step 3: Commit and Deploy

```bash
git add .
git commit -m "feat: Enable Google and Twitter OAuth sign-in

- Updated auth callback to create subscriber profiles for OAuth users
- Added OAuth buttons to signup page (already on login)
- Automatic username generation for OAuth users
- email_verified automatically set to true for OAuth
- Prevents duplicate subscriber creation

OAuth providers configured in Supabase:
- Google OAuth 2.0
- Twitter/X OAuth 2.0"

git push origin main
```

Vercel will automatically deploy in ~2 minutes.

---

## Troubleshooting

### Error: "OAuth provider not configured"
**Fix:** Make sure you enabled and saved the provider in Supabase Dashboard

### Error: "Redirect URI mismatch"
**Fix:** Check that callback URL in Google/Twitter matches exactly:
`https://yrwkufkhusfwikyfaime.supabase.co/auth/v1/callback`

### OAuth succeeds but no subscriber created
**Fix:** Check Supabase logs:
1. Dashboard → Logs → Database
2. Look for INSERT errors on subscribers table
3. May need to adjust username generation if conflicts

### User exists in auth.users but not subscribers
**Fix:** The callback handler will create the subscriber on first login after deploying the new code

---

## Security Notes

1. **Never commit OAuth secrets** - They're only in Supabase Dashboard
2. **Email verification** - OAuth users have email_verified = true automatically
3. **Username uniqueness** - System generates unique usernames automatically
4. **Existing users** - If email exists, OAuth sign-in fails with clear error

---

## After Deployment

### Monitor for Issues

Check these for 24 hours after deployment:
- Supabase logs for any auth errors
- Subscriber table for duplicate entries
- User reports of OAuth failures

### Update Documentation

Add to your user-facing help docs:
- How to sign in with Google
- How to sign in with Twitter
- What data we collect from OAuth providers (just email and name)
- How to unlink OAuth accounts (future feature)

---

## Future Enhancements

**Account Linking:**
- Allow users to link multiple OAuth providers to one account
- Merge OAuth account with existing email account

**Additional Providers:**
- GitHub (developer audience)
- Apple Sign-In (iOS users)
- Facebook (older demographic)

**Profile Enrichment:**
- Pull profile photo from OAuth provider
- Get timezone from OAuth data
- Pre-fill location if available

---

## Success Criteria

✅ Google OAuth working end-to-end  
✅ Twitter OAuth working end-to-end  
✅ Subscriber profiles created automatically  
✅ No duplicate subscribers  
✅ Existing email accounts protected  
✅ Smooth user experience (no errors)  

---

**Ready to enable?** Start with Part 1 (Google OAuth configuration) and work through each section!
