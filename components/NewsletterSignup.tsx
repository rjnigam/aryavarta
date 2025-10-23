'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface NewsletterSignupProps {
  variant?: 'light' | 'dark';
}

export function NewsletterSignup({ variant = 'light' }: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      const result = await response.json();
      
      // Store subscription status and username in localStorage
      localStorage.setItem('aryavarta_subscribed', 'true');
      localStorage.setItem('aryavarta_username', result.username);
      localStorage.setItem('aryavarta_subscribed_date', new Date().toISOString());

      setUsername(result.username);
      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = variant === 'dark';

  if (isSuccess) {
    return (
      <div className={`rounded-lg p-6 ${
        isDark ? 'bg-white/10 text-white' : 'bg-green-50 text-green-800'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle className={isDark ? 'text-white flex-shrink-0' : 'text-green-600 flex-shrink-0'} size={24} />
          <div>
            <p className="font-semibold text-lg">Welcome aboard! 🎉</p>
            <p className={`text-sm ${isDark ? 'text-white/80' : 'text-green-700'} mt-1`}>
              Check your email to confirm your subscription.
            </p>
          </div>
        </div>
        
        {username && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            isDark ? 'bg-white/5 border-white/20' : 'bg-white border-green-300'
          }`}>
            <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-green-900'}`}>
              Your Username:
            </p>
            <p className={`font-mono text-xl font-bold ${isDark ? 'text-saffron-300' : 'text-saffron-700'}`}>
              {username}
            </p>
            <p className={`text-xs mt-2 ${isDark ? 'text-white/70' : 'text-green-700'}`}>
              Save this — you'll use it to comment on articles soon!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          {...register('name')}
          type="text"
          placeholder="Your name"
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
            isDark
              ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-500'
          } ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className={`text-sm mt-1 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Your email address"
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition ${
            isDark
              ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/50'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-500'
          } ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className={`text-sm mt-1 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
            {errors.email.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`}>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark
            ? 'bg-white text-orange-600 hover:bg-orange-50'
            : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Subscribing...</span>
          </>
        ) : (
          <>
            <Mail size={20} />
            <span>Subscribe to Aryavarta</span>
          </>
        )}
      </button>
    </form>
  );
}
