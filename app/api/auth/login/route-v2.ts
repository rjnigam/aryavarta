import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create a response that we'll modify and return
    const response = NextResponse.json({ message: 'Processing...' });

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
            // Set cookie on the response we'll return
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

    // Sign in with email and password
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !authData.user || !authData.session) {
      return NextResponse.json(
        { message: signInError?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get or create subscriber profile
    let subscriber = null;
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    subscriber = existingSubscriber || {
      email: authData.user.email,
      name: email.split('@')[0],
      username: `user-${Date.now()}`,
      is_active: true,
      email_verified: !!authData.user.email_confirmed_at,
    };

    // Return success with the same response object (which has cookies set)
    return NextResponse.json(
      {
        message: 'Successfully logged in',
        user: {
          id: authData.user.id,
          email: subscriber.email,
          name: subscriber.name,
          username: subscriber.username,
        },
        session: {
          access_token: authData.session.access_token,
          expires_at: authData.session.expires_at,
        },
      },
      {
        status: 200,
        headers: response.headers,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}