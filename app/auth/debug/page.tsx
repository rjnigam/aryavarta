'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabaseAuth';

export default function AuthDebugPage() {
  const { user, subscriber, loading } = useAuth();
  const [browserSession, setBrowserSession] = useState<any>(null);
  const [browserUser, setBrowserUser] = useState<any>(null);
  const [sessionError, setSessionError] = useState<string>('');

  useEffect(() => {
    async function checkBrowserAuth() {
      try {
        const supabase = getSupabaseClient();
        
        // Check session
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          setSessionError(sessionErr.message);
        } else {
          setBrowserSession(session);
        }

        // Check user
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.error('User error:', userErr);
        } else {
          setBrowserUser(user);
        }
      } catch (error) {
        console.error('Browser auth check failed:', error);
      }
    }

    checkBrowserAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Information</h1>

        {/* Auth Context Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth Context (Server-side)</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
            <p><strong>Subscriber:</strong> {subscriber ? JSON.stringify(subscriber, null, 2) : 'null'}</p>
          </div>
        </div>

        {/* Browser Session Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Session (Client-side)</h2>
          {sessionError && (
            <p className="text-red-600 mb-4">Error: {sessionError}</p>
          )}
          <div className="space-y-2">
            <p><strong>Session:</strong> {browserSession ? 'Active' : 'None'}</p>
            {browserSession && (
              <>
                <p><strong>Expires:</strong> {new Date(browserSession.expires_at * 1000).toLocaleString()}</p>
                <p><strong>Access Token:</strong> {browserSession.access_token ? '***' + browserSession.access_token.slice(-10) : 'None'}</p>
              </>
            )}
          </div>
        </div>

        {/* Browser User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser User (Client-side)</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {browserUser ? 'Found' : 'None'}</p>
            {browserUser && (
              <>
                <p><strong>Email:</strong> {browserUser.email}</p>
                <p><strong>Email Verified:</strong> {browserUser.email_confirmed_at ? 'Yes' : 'No'}</p>
                <p><strong>ID:</strong> {browserUser.id}</p>
                <p><strong>Metadata:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(browserUser.user_metadata, null, 2)}
                </pre>
              </>
            )}
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {typeof document !== 'undefined' ? document.cookie : 'N/A'}
          </pre>
        </div>
      </div>
    </div>
  );
}