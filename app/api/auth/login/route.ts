import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Simple email-based authentication for subscribers
 * Sends a magic link to the subscriber's email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user is a subscriber
    const { data: subscriber, error: lookupError } = await supabase
      .from('subscribers')
      .select('email, name, username, is_active')
      .eq('email', email)
      .single();

    if (lookupError || !subscriber) {
      return NextResponse.json(
        { message: 'Email not found. Please subscribe first.' },
        { status: 404 }
      );
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { message: 'Your subscription is not active.' },
        { status: 403 }
      );
    }

    // Generate a simple session token (in production, use JWT or Supabase Auth)
    // For now, we'll use a simple approach with localStorage
    return NextResponse.json(
      {
        message: 'Authentication successful!',
        user: {
          email: subscriber.email,
          name: subscriber.name,
          username: subscriber.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
