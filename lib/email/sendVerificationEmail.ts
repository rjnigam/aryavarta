import { Resend } from 'resend';
import { getServiceSupabaseClient } from '@/lib/supabaseAdmin';

interface SendVerificationEmailOptions {
  email: string;
  name?: string | null;
  username?: string | null;
  redirectTo?: string;
  reason?: 'signup' | 'resend';
}

interface SendVerificationEmailResult {
  delivered: boolean;
  via: 'resend';
  actionLink: string;
}

/**
 * Generate a Supabase email verification link and dispatch it via Resend.
 * Throws if configuration is missing or delivery fails.
 */
export async function sendVerificationEmail({
  email,
  name,
  username,
  redirectTo,
  reason = 'signup',
}: SendVerificationEmailOptions): Promise<SendVerificationEmailResult> {
  if (!email) {
    throw new Error('sendVerificationEmail requires an email');
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
    throw new Error('Resend API key is not configured');
  }

  const siteUrl = (redirectTo ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

  const supabaseAdmin = getServiceSupabaseClient();
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (linkError) {
    throw new Error(`Failed to generate verification link: ${linkError.message}`);
  }

  const actionLink = linkData?.properties?.action_link;

  if (!actionLink) {
    throw new Error('Supabase did not return a verification action link');
  }

  const resend = new Resend(resendApiKey);

  const greeting = name ? `Namaste ${name.split(' ')[0]}` : 'Namaste';
  const usernameLine = username
    ? `<p style="color: #166534; font-size: 15px; margin: 0 0 16px 0;">Your community username: <strong style="font-family: monospace; color: #c2410c;">${username}</strong></p>`
    : '';
  const reasonCopy =
    reason === 'signup'
      ? 'Thank you for joining Aryavarta. Please confirm your email to activate your account and participate in future discussions.'
      : 'Here is a fresh verification link so you can activate your Aryavarta account.';

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; background: #fefce8; padding: 32px 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(194, 65, 12, 0.08); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f97316, #c2410c); padding: 28px 24px; color: #fff;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.04em; text-transform: uppercase;">Aryavarta</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95;">Wisdom from the Vedic tradition</p>
        </div>
        <div style="padding: 32px 24px 28px 24px;">
          <p style="color: #78350f; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">${greeting} 🙏</p>
          <p style="color: #44403c; line-height: 1.7; font-size: 15px; margin: 0 0 16px 0;">${reasonCopy}</p>
          ${usernameLine}
          <div style="text-align: center; margin: 28px 0;">
            <a href="${actionLink}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: 600; letter-spacing: 0.02em;">Verify my email</a>
          </div>
          <p style="color: #57534e; font-size: 14px; line-height: 1.6; margin: 0 0 14px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #854d0e; font-size: 13px; word-break: break-all; background: #fef3c7; padding: 12px 14px; border-radius: 8px; border: 1px solid #fde68a;">${actionLink}</p>
          <p style="color: #7c2d12; font-size: 14px; margin: 24px 0 0 0; font-style: italic;">Dharma protects those who uphold it.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">This link is valid for a limited time. If you did not request this, you can safely ignore the email.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Aryavarta <noreply@arya-varta.in>',
      to: email,
      subject:
        reason === 'signup'
          ? 'Confirm your Aryavarta account'
          : 'Your new Aryavarta verification link',
      html,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email delivery error';
    throw new Error(`Failed to send verification email: ${message}`);
  }

  return {
    delivered: true,
    via: 'resend',
    actionLink,
  };
}