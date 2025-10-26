'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, signInWithProvider } from '@/lib/supabaseAuth';
import {
  PASSWORD_REQUIREMENTS,
  getPasswordStrengthMeta,
  getUnmetPasswordRequirements,
} from '@/lib/passwordPolicy';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'twitter' | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const passwordStrength = getPasswordStrengthMeta(password);
  const requirementStates = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(password),
  }));
  const allRequirementsMet = requirementStates.every((req) => req.met);

  const handleProviderSignIn = async (provider: 'google' | 'twitter') => {
    setError('');
    setSocialLoading(provider);

    try {
      await signInWithProvider(provider);
      // Redirect handled by Supabase OAuth flow
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to sign up with ${provider === 'google' ? 'Google' : 'Twitter'}`
      );
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const unmetRequirements = getUnmetPasswordRequirements(password).map((req) =>
        req.label.toLowerCase()
      );

      if (unmetRequirements.length > 0) {
        throw new Error(`Password must include ${unmetRequirements.join(', ')}`);
      }

      // Call server-side signup API which handles both auth user and subscriber creation
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up. Please try again.');
      }

      // Success
      setSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendFeedback(null);
    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to resend verification email.');
      }

      setResendFeedback({
        type: 'success',
        message:
          data.message || 'Verification email resent. Please check your inbox or spam folder.',
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to resend verification email. Please try again later.';
      setResendFeedback({ type: 'error', message });
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-saffron-200 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
              Please click the link to verify your email and activate your account.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Didn&apos;t receive the email? Check your spam folder or click below to send it again.
            </p>
            {resendFeedback && (
              <div
                className={`${
                  resendFeedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                } border px-4 py-3 rounded mb-4 text-sm`}
              >
                {resendFeedback.message}
              </div>
            )}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="w-full mb-4 py-2 px-4 border border-saffron-200 text-sm font-medium rounded-md text-saffron-700 bg-white hover:bg-saffron-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending another email...' : 'Resend verification email'}
            </button>
            <Link
              href="/auth/login"
              className="inline-block py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-saffron-900 mb-2">Join Aryavarta</h1>
          <p className="text-gray-600">Create your account to start engaging with our community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg border border-saffron-200">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleProviderSignIn('google')}
              disabled={loading || socialLoading !== null}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? 'Redirecting to Google…' : 'Sign up with Google'}
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignIn('twitter')}
              disabled={loading || socialLoading !== null}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'twitter' ? 'Redirecting to Twitter…' : 'Sign up with Twitter'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase tracking-wider text-gray-400">Or sign up with email</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                placeholder="At least 8 characters"
              />
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength.percent}%`,
                          backgroundColor: passwordStrength.score <= 2 ? '#ef4444' : 
                                         passwordStrength.score === 3 ? '#f97316' : 
                                         passwordStrength.score === 4 ? '#eab308' : '#22c55e'
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 min-w-[3rem] text-right">{passwordStrength.label}</span>
                  </div>
                  <ul className="space-y-1">
                    {requirementStates.map((req) => (
                      <li
                        key={req.id}
                        className={`flex items-center text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        <span
                          className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold ${
                            req.met
                              ? 'bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {req.met ? '✓' : '•'}
                        </span>
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                placeholder="Re-enter your password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500">
              By signing up, you agree to our{' '}
            <Link href="/terms" className="text-saffron-600 hover:text-saffron-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-saffron-600 hover:text-saffron-500">
              Privacy Policy
            </Link>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={
                loading ||
                (password !== confirmPassword && confirmPassword.length > 0) ||
                !allRequirementsMet
              }
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-saffron-600 hover:text-saffron-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
