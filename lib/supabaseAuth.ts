import { createBrowserClient } from '@supabase/ssr';
import type { AuthChangeEvent, Provider, Session, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create Supabase client for browser (client components)
 * This handles authentication state and sessions
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();

  console.log('[supabaseAuth] Attempting sign in for:', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('[supabaseAuth] Sign in error:', error);
    throw error;
  }

  console.log('[supabaseAuth] Sign in successful:', {
    user: data.user?.email,
    session: !!data.session,
  });

  return data;
}

/**
 * Begin OAuth sign-in flow with a social provider
 */
export async function signInWithProvider(provider: Provider) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    // Call the logout API route to ensure server-side session is cleared
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookie handling
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign out');
    }

    // Optionally, also sign out from client-side to ensure local state is cleared
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();

  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const supabase = getSupabaseClient();

  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Get user's subscriber profile
 */
export async function getSubscriberProfile() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', user.email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
