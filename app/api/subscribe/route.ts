import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { message: 'Email and name are required' },
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

    // Check if email already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: 'This email is already subscribed!' },
        { status: 400 }
      );
    }

    // Insert new subscriber
    const { data: newSubscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert([
        {
          email,
          name,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase error:', insertError);
      throw new Error('Failed to save subscription');
    }

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
      try {
        const emailResult = await resend.emails.send({
          from: 'Aryavarta <noreply@arya-varta.in>',
          to: email,
          subject: 'Welcome to Aryavarta - नमस्ते! 🙏',
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #c2410c; font-size: 32px; margin: 0;">आर्यवर्त</h1>
                <p style="color: #78716c; font-size: 14px; margin: 5px 0;">Aryavarta</p>
              </div>
              
              <div style="border-top: 3px solid #c2410c; padding-top: 20px;">
                <h2 style="color: #1f2937; font-size: 24px;">Welcome, ${name}! 🙏</h2>
                
                <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
                  Thank you for joining our journey to rediscover the timeless wisdom of ancient India.
                </p>
                
                <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
                  Every week, you'll receive carefully researched insights from the Vedas, Upanishads, 
                  and other sacred texts — bringing 5000+ years of knowledge to your inbox.
                </p>
                
                <div style="background: linear-gradient(to right, #fff7ed, #fefce8); border-left: 4px solid #c2410c; padding: 20px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #78350f; font-style: italic; margin: 0; font-size: 16px;">
                    "योगः कर्मसु कौशलम्"<br/>
                    <span style="font-size: 14px;">Excellence in Action</span>
                  </p>
                </div>
                
                <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
                  In the meantime, explore our latest articles on 
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://arya-varta.in'}" 
                     style="color: #c2410c; text-decoration: none; font-weight: 600;">
                    arya-varta.in
                  </a>
                </p>
                
                <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin-top: 30px;">
                  With gratitude,<br/>
                  <strong>The Aryavarta Team</strong>
                </p>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Aryavarta. All rights reserved. • सत्यं वद धर्मं चर
                </p>
              </div>
            </div>
          `,
        });
        console.log('Welcome email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json(
      { 
        message: 'Successfully subscribed! Check your email for a welcome message.',
        email,
        name 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
