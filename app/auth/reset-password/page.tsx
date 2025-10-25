'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  resetPassword as supabaseResetPassword,
  updatePassword as supabaseUpdatePassword,
  onAuthStateChange,
  getSupabaseClient,
} from '@/lib/supabaseAuth';
import {
  PASSWORD_REQUIREMENTS,
  getPasswordStrengthMeta,
  getUnmetPasswordRequirements,
} from '@/lib/passwordPolicy';

interface Feedback {
  type: 'success' | 'error';
  text: string;
}

type ResetMode = 'request' | 'update';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState<ResetMode>('request');
  const [email, setEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState<Feedback | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<Feedback | null>(null);

  // Detect recovery mode when arriving from email link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supabase = getSupabaseClient();
      const currentUrl = new URL(window.location.href);
      const hashParams = new URLSearchParams(currentUrl.hash.replace(/^#/, ''));
      const searchParams = currentUrl.searchParams;

      const recoveryDetected =
        hashParams.get('type') === 'recovery' || searchParams.get('type') === 'recovery';

      if (recoveryDetected) {
        setMode('update');
      }

      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const code = searchParams.get('code');

      const cleanupUrl = () => {
        const sanitizedUrl = new URL(window.location.href);
        sanitizedUrl.hash = '';
        sanitizedUrl.searchParams.delete('code');
        sanitizedUrl.searchParams.delete('type');
        window.history.replaceState(null, document.title, sanitizedUrl.toString());
      };

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => {
            setMode('update');
            cleanupUrl();
          })
          .catch((error) => console.error('Failed to establish recovery session:', error));
      } else if (code && searchParams.get('type') === 'recovery') {
        supabase.auth
          .exchangeCodeForSession(code)
          .then(() => {
            setMode('update');
            cleanupUrl();
          })
          .catch((error) => console.error('Failed to exchange recovery code for session:', error));
      }
    }

    const { data: subscription } = onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update');
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const requirementStates = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((requirement) => ({
        ...requirement,
        met: requirement.test(newPassword),
      })),
    [newPassword]
  );

  const passwordStrength = useMemo(() => getPasswordStrengthMeta(newPassword), [newPassword]);
  const allRequirementsMet = useMemo(
    () => requirementStates.every((requirement) => requirement.met),
    [requirementStates]
  );

  const handleRequestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestFeedback(null);
    setRequestLoading(true);

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await supabaseResetPassword(email);

      setRequestFeedback({
        type: 'success',
        text: `If an account exists for ${email}, a reset link has been sent. Please check your inbox.`,
      });
    } catch (error) {
      setRequestFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to send reset email. Please try again.',
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdateFeedback(null);
    setUpdateLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        throw new Error('Please fill in both password fields');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const unmetRequirements = getUnmetPasswordRequirements(newPassword);

      if (unmetRequirements.length > 0) {
        throw new Error(
          `Password must include ${unmetRequirements
            .map((requirement) => requirement.label.toLowerCase())
            .join(', ')}`
        );
      }

      await supabaseUpdatePassword(newPassword);

      setUpdateFeedback({
        type: 'success',
        text: 'Password updated successfully! Redirecting you to sign in...',
      });

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState(null, document.title, url.toString());
      }

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setUpdateFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to update password. Please try again.',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-saffron-900 mb-2">
            {mode === 'request' ? 'Forgot your password?' : 'Set a new password'}
          </h1>
          <p className="text-gray-600">
            {mode === 'request'
              ? 'Enter your email address and we will send you a link to reset your password.'
              : 'Create a new password to regain access to your account.'}
          </p>
        </div>

        {mode === 'request' ? (
          <form
            onSubmit={handleRequestReset}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-saffron-200"
          >
            {requestFeedback && (
              <div
                className={`${
                  requestFeedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                } border px-4 py-3 rounded`}
              >
                {requestFeedback.text}
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={requestLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {requestLoading ? 'Sending reset link...' : 'Send reset link'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link href="/auth/login" className="text-saffron-600 hover:text-saffron-500 font-medium">
                Back to sign in
              </Link>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleUpdatePassword}
            className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-saffron-200"
          >
            {updateFeedback && (
              <div
                className={`${
                  updateFeedback.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                } border px-4 py-3 rounded`}
              >
                {updateFeedback.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                  placeholder="Create a strong password"
                />

                {newPassword.length > 0 && (
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
                      {requirementStates.map((requirement) => (
                        <li
                          key={requirement.id}
                          className={`flex items-center text-xs ${
                            requirement.met ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          <span
                            className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold ${
                              requirement.met
                                ? 'bg-green-50 border-green-500 text-green-600'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}
                          >
                            {requirement.met ? '✓' : '•'}
                          </span>
                          {requirement.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-saffron-500 focus:border-saffron-500 sm:text-sm"
                  placeholder="Repeat your password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                updateLoading ||
                !allRequirementsMet ||
                (confirmPassword.length > 0 && newPassword !== confirmPassword)
              }
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? 'Saving new password...' : 'Save new password'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Changed your mind?{' '}
              <Link href="/auth/login" className="text-saffron-600 hover:text-saffron-500 font-medium">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
