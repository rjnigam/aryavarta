'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseAuth';

export default function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const supabase = getSupabaseClient();
      
      // Test 1: Direct login
      console.log('Testing direct login...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (loginError) {
        setResult({ error: loginError.message });
        return;
      }
      
      // Test 2: Check session immediately
      console.log('Checking session immediately...');
      const { data: { session: immediateSession } } = await supabase.auth.getSession();
      
      // Test 3: Check session after delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Checking session after delay...');
      const { data: { session: delayedSession } } = await supabase.auth.getSession();
      
      // Test 4: Check user
      console.log('Checking user...');
      const { data: { user } } = await supabase.auth.getUser();
      
      // Test 5: Check cookies
      const cookies = document.cookie;
      
      setResult({
        loginSuccess: true,
        hasSession: !!loginData.session,
        hasImmediateSession: !!immediateSession,
        hasDelayedSession: !!delayedSession,
        hasUser: !!user,
        userEmail: user?.email,
        cookies: cookies.includes('sb-') ? 'Supabase cookies present' : 'No Supabase cookies',
        sessionExpiry: loginData.session?.expires_at ? new Date(loginData.session.expires_at * 1000).toLocaleString() : null,
      });
      
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test Login Debugging</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              onClick={testLogin}
              disabled={loading || !email || !password}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Results:</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}