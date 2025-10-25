import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Get current user session and profile
 */
export async function GET(request: NextRequest) {
  try {
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ user: null, subscriber: null }, { status: 200 });
    }

    // Fetch subscriber profile - first try auth_user_id, then email
    let subscriber = null;
    
    // Try auth_user_id first
    const { data: authSubscriber, error: authError } = await supabase
      .from('subscribers')
      .select('id, email, name, username, is_active, subscribed_at')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!authError && authSubscriber) {
      subscriber = authSubscriber;
    } else if (user.email) {
      // Fallback to email lookup
      const { data: emailSubscriber, error: emailError } = await supabase
        .from('subscribers')
        .select('id, email, name, username, is_active, subscribed_at')
        .eq('email', user.email)
        .maybeSingle();
      
      if (!emailError && emailSubscriber) {
        subscriber = emailSubscriber;
      }
    }

    // If no subscriber found, that's OK - they might be a new user
    if (!subscriber) {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.email_confirmed_at !== null,
        },
        subscriber: null,
      }, { status: 200 });
    }

    const subscriberPayload = {
      ...subscriber,
      username: subscriber.username || user.email?.split('@')[0] || 'seeker',
      email_verified: user.email_confirmed_at !== null,
    };

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.email_confirmed_at !== null,
        },
        subscriber: subscriberPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
