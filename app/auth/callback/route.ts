import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Auth callback handler for email verification and password resets
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
    });

    // After successful email verification, update subscriber record
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.email_confirmed_at) {
      // Update email_verified in subscribers table
      await supabase
        .from('subscribers')
        .update({ email_verified: true })
        .eq('email', user.email);
    }

    // Determine where to redirect after successful verification
    let redirectUrl: URL;
    if (type === 'signup' && user?.email_confirmed_at) {
      // After signup verification, redirect to home page (user is now logged in)
      redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('welcome', 'true');
    } else {
      // For other callbacks (password reset, etc.) use the next parameter or default to home
      redirectUrl = new URL(next, request.url);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // No code present, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
