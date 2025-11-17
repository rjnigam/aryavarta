import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { generateUniqueUsername } from '@/lib/usernameGenerator';
import { getUnmetPasswordRequirements } from '@/lib/passwordPolicy';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    const unmetPasswordRequirements = getUnmetPasswordRequirements(password);

    if (unmetPasswordRequirements.length > 0) {
      return NextResponse.json(
        {
          error: `Password must include ${unmetPasswordRequirements
            .map((requirement) => requirement.label.toLowerCase())
            .join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
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

    // Check if user already exists in subscribers table
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingSubscriber) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists. Please log in.',
        },
        { status: 400 }
      );
    }

    // IMPORTANT: Also check auth.users table using admin client
    // This prevents the silent failure when email exists in auth but not subscribers
    const { getServiceSupabaseClient } = await import('@/lib/supabaseAdmin');
    const supabaseAdmin = getServiceSupabaseClient();
    
    const { data: existingAuthUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingAuthUser?.users.some(user => user.email === email);
    
    if (emailExists) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists. Please log in or use a different email.',
        },
        { status: 400 }
      );
    }

    let username: string;
    username = await generateUniqueUsername(supabase, { baseName: name.trim() });

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
          username,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error('Supabase signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message || 'Failed to create account' },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Create subscriber record immediately after auth user creation
    try {
      const { error: subscriberError } = await supabase
        .from('subscribers')
        .insert({
          email: authData.user.email!,
          name: name.trim(),
          username,
          is_active: true,
          auth_user_id: authData.user.id,
          email_verified: false, // Will be updated after email verification
        });

      if (subscriberError) {
        console.error('Failed to create subscriber record:', subscriberError);
        // Don't fail the signup, but log the error
        // The login flow will create it if missing
      }
    } catch (subscriberCreationError) {
      console.error('Subscriber creation error:', subscriberCreationError);
      // Continue with signup even if subscriber creation fails
    }

    // Email is now handled by Supabase SMTP configuration
    // No need to send custom email here

    return NextResponse.json(
      {
        message: 'Account created successfully! Please check your email to verify your account.',
        user: {
          email: authData.user.email,
          name,
          username,
        },
        requiresEmailVerification: !authData.session, // If no session, email verification required
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup. Please try again later.' },
      { status: 500 }
    );
  }
}