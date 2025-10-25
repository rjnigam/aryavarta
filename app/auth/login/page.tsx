'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, signInWithProvider } from '@/lib/supabaseAuth';

type SupportedSocialProvider = 'google' | 'twitter';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SupportedSocialProvider | null>(null);

  const handleProviderSignIn = async (provider: SupportedSocialProvider) => {
    setError('');
    setSocialLoading(provider);

    try {
      await signInWithProvider(provider);
      // Redirect handled by Supabase OAuth flow
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to sign in with ${provider === 'google' ? 'Google' : 'Twitter'}`
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
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Attempt login
      await signIn(email, password);

      // Success - redirect
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-saffron-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Aryavarta account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg border border-saffron-200">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleProviderSignIn('google')}
              disabled={socialLoading !== null}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? 'Redirecting to Google…' : 'Continue with Google'}
            </button>
            <button
              type="button"
              onClick={() => handleProviderSignIn('twitter')}
              disabled={socialLoading !== null}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'twitter' ? 'Redirecting to Twitter…' : 'Continue with Twitter'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase tracking-wider text-gray-400">Or sign in with email</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-4">
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/auth/reset-password" className="font-medium text-saffron-600 hover:text-saffron-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-saffron-600 hover:text-saffron-500">
                Sign up
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
