import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Auth callback handler for email verification, password resets, and OAuth
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
      provider: data?.user?.app_metadata?.provider,
    });

    // AUTO-CONFIRM OAUTH USERS
    // Since OAuth providers (like Google) already verify emails,
    // we don't need users to confirm their email again
    if (data?.user) {
      const isOAuthUser = data.user.app_metadata?.provider === 'google';
      const emailNotConfirmed = !data.user.email_confirmed_at;
      
      if (isOAuthUser && emailNotConfirmed) {
        console.log('[Auth Callback] Auto-confirming OAuth user email');
        
        // Use admin client to confirm email
        const supabaseAdmin = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

        try {
          const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
            data.user.id,
            { email_confirm: true }
          );
          
          if (confirmError) {
            console.error('[Auth Callback] Failed to auto-confirm email:', confirmError);
          } else {
            console.log('[Auth Callback] OAuth user email auto-confirmed successfully');
          }
        } catch (err) {
          console.error('[Auth Callback] Error auto-confirming email:', err);
        }
      }
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if subscriber profile exists
      const { data: existingSubscriber } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', user.email!)
        .maybeSingle();

      if (!existingSubscriber) {
        // Create subscriber profile for OAuth user
        console.log('[Auth Callback] Creating subscriber profile for OAuth user');
        
        // Get or generate username
        const { generateUniqueUsername } = await import('@/lib/usernameGenerator');
        const name = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'user';
        
        const username = await generateUniqueUsername(supabase, { baseName: name });

        try {
          const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
              email: user.email!,
              name: name,
              username: username,
              is_active: true,
              auth_user_id: user.id,
              email_verified: user.email_confirmed_at ? true : false,
            });

          if (insertError) {
            console.error('[Auth Callback] Failed to create subscriber:', insertError);
          } else {
            console.log('[Auth Callback] Subscriber profile created successfully');
          }
        } catch (err) {
          console.error('[Auth Callback] Subscriber creation error:', err);
        }
      } else if (user.email_confirmed_at) {
        // Update email_verified for existing users
        await supabase
          .from('subscribers')
          .update({ email_verified: true })
          .eq('email', user.email!);
      }
    }

    // Determine where to redirect after successful verification
    let redirectUrl: URL;
    if (type === 'signup' && user?.email_confirmed_at) {
      // After signup verification, redirect to home page with welcome message
      redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('welcome', 'true');
    } else if (data?.user?.app_metadata?.provider) {
      // OAuth sign-in, redirect to home
      redirectUrl = new URL('/', request.url);
    } else {
      // For other callbacks (password reset, etc.) use the next parameter
      redirectUrl = new URL(next, request.url);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // No code present, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
