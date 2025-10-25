import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    // Create response object first
    const response = NextResponse.json(
      { message: 'Successfully logged out' },
      { status: 200 }
    );

    // Create Supabase client with proper cookie handling
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
              sameSite: 'lax',
              secure: false, // Use false for localhost
              path: '/',
            });
          },
          remove(name: string, options: CookieOptions) {
            // Properly remove cookies by setting them as expired
            response.cookies.set({
              name,
              value: '',
              expires: new Date(0), // Set to past date to ensure removal
              ...options,
              sameSite: 'lax',
              secure: false, // Use false for localhost
              path: '/',
            });
          },
        },
      }
    );

    // Sign out - this will trigger the remove cookie callbacks
    await supabase.auth.signOut();

    // Manually clear any additional auth cookies to be sure
    const authCookies = ['sb-access-token', 'sb-refresh-token'];
    authCookies.forEach(cookieName => {
      response.cookies.delete({
        name: cookieName,
        path: '/',
      });
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
