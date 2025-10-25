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

  if (code) {
    const redirectTarget = type === 'signup' ? '/auth/login' : next;
    const redirectUrl = new URL(redirectTarget, request.url);
    if (type === 'signup') {
      redirectUrl.searchParams.set('verification', 'true');
    }
    const response = NextResponse.redirect(redirectUrl);

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      if (type === 'signup') {
        redirectUrl.searchParams.set('verification', 'false');
      } else {
        redirectUrl.searchParams.set('error', 'auth-callback');
      }
      return NextResponse.redirect(redirectUrl);
    }

    // After successful email verification, update subscriber record
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.email_confirmed_at) {
      // Update email_verified in subscribers table
      await supabase
        .from('subscribers')
        .update({ email_verified: true })
        .eq('email', user.email);
    }

    return response;
  }

  // No code present, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
