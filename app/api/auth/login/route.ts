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

    // Create Supabase client for server-side
    const response = NextResponse.next();
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
      const metadata = authData.user.user_metadata ?? {};
      const derivedName = (metadata.name as string | undefined)?.trim() || email.split('@')[0];
      const derivedUsername = metadata.username as string | undefined;

      const username = derivedUsername || (await generateUniqueUsername(supabase, { baseName: derivedName }));

      const insertPayload = {
        email: authData.user.email,
        name: derivedName,
        username,
        is_active: true,
        auth_user_id: authData.user.id,
        email_verified: !!authData.user.email_confirmed_at,
      };

      const { data: createdSubscriber, error: createError } = await supabase
        .from('subscribers')
        .insert(insertPayload)
        .select('username, email, name, is_active, email_verified, auth_user_id')
        .single();

      if (createError) {
        console.error('Failed to create subscriber via session-scoped client:', createError);

        try {
          const serviceSupabase = getServiceSupabaseClient();
          const { data: serviceSubscriber, error: serviceError } = await serviceSupabase
            .from('subscribers')
            .insert(insertPayload)
            .select('username, email, name, is_active, email_verified, auth_user_id')
            .single();

          if (serviceError) {
            console.error('Service client subscriber creation failed:', serviceError);
            return NextResponse.json(
              { error: 'Account profile could not be created. Please contact support.' },
              { status: 500 }
            );
          }

          subscriber = serviceSubscriber;
        } catch (adminError) {
          console.error('Service client unavailable for subscriber creation:', adminError);
          return NextResponse.json(
            { error: 'Account profile could not be created. Please contact support.' },
            { status: 500 }
          );
        }
      } else {
        subscriber = createdSubscriber;
      }
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { error: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    // Sync subscriber metadata with Supabase Auth records
    if ((subscriber.email_verified !== undefined && !subscriber.email_verified) || !subscriber.auth_user_id) {
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login. Please try again later.' },
      { status: 500 }
    );
  }
}
