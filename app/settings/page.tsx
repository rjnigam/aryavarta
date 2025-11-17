'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, subscriber, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/settings');
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
        <h1 className="text-3xl font-bold text-saffron-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Email Address</p>
                  <p className="text-sm">{subscriber.email}</p>
                </div>
                <button 
                  disabled
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-400 cursor-not-allowed"
                >
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm">••••••••</p>
                </div>
                <button 
                  disabled
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-400 cursor-not-allowed"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Newsletter</p>
                  <p className="text-sm text-gray-600">Receive weekly articles</p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    checked={subscriber.is_active}
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-saffron-600"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Comment Replies</p>
                  <p className="text-sm text-gray-600">Get notified when someone replies</p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-sm text-gray-600">Show your profile to other users</p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    disabled
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <button 
                  disabled
                  className="px-4 py-2 text-sm border border-red-300 rounded-md text-red-400 cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Coming Soon Note */}
          <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-4">
            <p className="text-sm text-saffron-900">
              <strong>Note:</strong> Settings functionality is coming soon! These controls are currently disabled while we build out the full feature set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
