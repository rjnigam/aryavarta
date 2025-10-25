'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, subscriber, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
      </div>
    );
  }

  if (!user || !subscriber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-saffron-900 mb-8">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white text-3xl font-bold">
              {subscriber.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{subscriber.name}</h2>
              <p className="text-gray-600">@{subscriber.username}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{subscriber.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Status</label>
              <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                subscriber.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {subscriber.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Verification</label>
              <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                subscriber.email_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {subscriber.email_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>

            {subscriber.subscribed_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-gray-900">
                  {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Coming Soon Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✨ Edit profile information</li>
              <li>✨ Change password</li>
              <li>✨ Manage notification preferences</li>
              <li>✨ Reading history and bookmarks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
