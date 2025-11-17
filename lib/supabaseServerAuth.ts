import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Get Supabase client for server-side operations with auth cookies
 */
export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get the authenticated user from request cookies
 */
export async function getUser(request: NextRequest) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  return user;
}

/**
 * Get the authenticated session from request cookies
 */
export async function getSession(request: NextRequest) {
  const supabase = await createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return session;
}

/**
 * Get the subscriber profile for the authenticated user
 */
export async function getAuthenticatedSubscriber(request: NextRequest) {
  const user = await getUser(request);
  
  if (!user) {
    return null;
  }
  
  // Use regular supabase client (not admin) to respect RLS
  const { data: subscriber, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();
  
  if (error || !subscriber) {
    // Fallback to email lookup for legacy users
    const { data: emailSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', user.email)
      .single();
      
    return emailSubscriber;
  }
  
  return subscriber;
}

/**
 * Middleware helper to verify authentication
 */
export async function requireAuth(
  request: NextRequest,
  handler: (user: any, subscriber: any) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const subscriber = await getAuthenticatedSubscriber(request);
  
  if (!subscriber || !subscriber.is_active) {
    return NextResponse.json(
      { error: 'Active subscription required' },
      { status: 403 }
    );
  }
  
  return handler(user, subscriber);
}

/**
 * Create a Supabase client for middleware
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}