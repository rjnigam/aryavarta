import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { generateUniqueUsername } from '@/lib/usernameGenerator';
import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';

/**
 * Password-based authentication for subscribers
 * Validates email and password against Supabase Auth
 */
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create the response we'll return (with cookies)
    const response = NextResponse.json({ processing: true });
    
    // Create Supabase client for server-side with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // IMPORTANT: Set cookies on the response object with consistent settings
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

    // Sign in with email and password
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Supabase signin error:', signInError);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { message: 'Failed to sign in' },
        { status: 401 }
      );
    }

    // Fetch subscriber profile
    let { data: subscriber, error: profileError } = await supabase
      .from('subscribers')
      .select('username, email, name, is_active, email_verified, auth_user_id')
      .eq('email', authData.user.email)
      .maybeSingle();

    if (profileError) {
      console.error('Failed to fetch subscriber profile:', profileError);
    }

    if (!subscriber) {
      // If no subscriber exists, create a minimal record but don't fail login
      const metadata = authData.user.user_metadata ?? {};
      const derivedName = (metadata.name as string | undefined)?.trim() || email.split('@')[0];
      const derivedUsername = metadata.username as string | undefined;

      const username = derivedUsername || (await generateUniqueUsername(null, { baseName: derivedName }));

      // Create a minimal subscriber object for the response
      subscriber = {
        email: authData.user.email,
        name: derivedName,
        username,
        is_active: true,
        email_verified: !!authData.user.email_confirmed_at,
        auth_user_id: authData.user.id,
      };

      // Try to create the subscriber record in the background
      // Don't fail the login if this fails - we'll create it later
      try {
        const serviceSupabase = getServiceSupabaseClient();
        const { error: serviceError } = await serviceSupabase
          .from('subscribers')
          .insert({
            email: authData.user.email,
            name: derivedName,
            username,
            is_active: true,
            auth_user_id: authData.user.id,
            email_verified: !!authData.user.email_confirmed_at,
          });

        if (serviceError) {
          console.error('Background subscriber creation failed:', serviceError);
          // Don't fail login - subscriber record will be created on next interaction
        }
      } catch (error) {
        console.error('Service client error during subscriber creation:', error);
        // Continue with login anyway
      }
    }

      if (subscriber && !subscriber.is_active) {
      return NextResponse.json(
        { message: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }    // Sync subscriber metadata with Supabase Auth records only if subscriber exists in DB
    if (subscriber && 'id' in subscriber && ((subscriber.email_verified !== undefined && !subscriber.email_verified) || !subscriber.auth_user_id)) {
      if (authData.user.email_confirmed_at) {
        await supabase
          .from('subscribers')
          .update({
            email_verified: true,
            auth_user_id: authData.user.id,
          })
          .eq('email', subscriber.email);
      } else if (!subscriber.auth_user_id) {
        await supabase
          .from('subscribers')
          .update({ auth_user_id: authData.user.id })
          .eq('email', subscriber.email);
      }
    }

    // Update the response body (the response object already has cookies set by Supabase)
    const responseBody = {
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
    };

    // Return a new response with the body and headers from our cookie-enabled response
    return NextResponse.json(responseBody, {
      status: 200,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login. Please try again later.' },
      { status: 500 }
    );
  }
}
