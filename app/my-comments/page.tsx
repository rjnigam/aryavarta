'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyCommentsPage() {
  const { user, subscriber, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/my-comments');
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
        <h1 className="text-3xl font-bold text-saffron-900 mb-8">My Comments</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-saffron-100 mb-4">
              <svg 
                className="h-8 w-8 text-saffron-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Comments Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t posted any comments yet. Start engaging with articles to see your comments here.
            </p>
            <button
              onClick={() => router.push('/articles')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-saffron-600 hover:bg-saffron-700 transition-colors"
            >
              Browse Articles
            </button>
          </div>

          {/* Coming Soon Features */}
          <div className="border-t mt-8 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✨ View all your comments in one place</li>
              <li>✨ See replies to your comments</li>
              <li>✨ Edit or delete your comments</li>
              <li>✨ Filter by article or date</li>
              <li>✨ Track comment engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
