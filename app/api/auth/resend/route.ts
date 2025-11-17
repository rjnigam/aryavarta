import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration for resend endpoint');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const serviceSupabase = getServiceSupabaseClient();

    // Check if user exists and needs verification
    const { data: subscriber } = await serviceSupabase
      .from('subscribers')
      .select('email, email_verified, name, username')
      .eq('email', email)
      .maybeSingle();

    if (!subscriber) {
      // Don't reveal whether email exists for security
      return NextResponse.json(
        { message: 'If an account exists for this email, a verification link has been sent.' },
        { status: 200 }
      );
    }

    if (subscriber.email_verified) {
      return NextResponse.json(
        { error: 'This email is already verified. You can log in directly.' },
        { status: 400 }
      );
    }

  let delivered = false;
  let via: 'supabase' | 'resend' | null = null;

    const { error: supabaseResendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (supabaseResendError) {
      console.warn('Supabase resend failed:', supabaseResendError.message ?? supabaseResendError);
    } else {
      delivered = true;
      via = 'supabase';
    }

    if (!delivered && resendApiKey && resendApiKey !== 'your_resend_api_key_here') {
      try {
        await sendVerificationEmail({
          email,
          name: subscriber.name,
          username: subscriber.username,
          reason: 'resend',
        });
        delivered = true;
        via = 'resend';
      } catch (fallbackError) {
        const errorObject = fallbackError instanceof Error ? fallbackError : new Error('Unknown fallback error');
        console.error('Resend fallback verification email failed:', errorObject);
      }
    }

    if (!delivered) {
      return NextResponse.json(
        {
          error:
            'Unable to resend verification email right now. Please wait a few minutes and try again, or contact support@arya-varta.in.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        message:
          via === 'resend'
            ? 'Verification email sent via backup provider. Please check your inbox and spam folder.'
            : 'Verification email sent. Please check your inbox and spam folder.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Unable to resend verification email. Please try again later.' },
      { status: 500 }
    );
  }
}
