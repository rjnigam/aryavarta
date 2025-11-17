'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TestAccountSwitching() {
  const { user, subscriber, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const router = useRouter();

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    addStatus('Starting logout...');
    
    try {
      await signOut();
      addStatus('Logout successful! Redirecting to login...');
      
      // Wait a moment to ensure state updates
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch (error) {
      addStatus(`Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(';');
    const authCookies = cookies.filter(c => 
      c.trim().startsWith('sb-') || c.trim().startsWith('supabase-')
    );
    
    addStatus('Current auth cookies:');
    if (authCookies.length === 0) {
      addStatus('  No auth cookies found');
    } else {
      authCookies.forEach(c => {
        const [name, value] = c.trim().split('=');
        addStatus(`  ${name}: ${value ? 'present' : 'empty'}`);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Test Account Switching</h1>
      
      {/* Current User Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User:</h2>
        {user ? (
          <div className="space-y-1">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {subscriber?.username || 'Loading...'}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Verified:</strong> {subscriber?.email_verified ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <p className="text-gray-500">Not logged in</p>
        )}
      </div>

      {/* Actions */}
      <div className="mb-6 space-y-3">
        <button
          onClick={checkCookies}
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Check Auth Cookies
        </button>
        
        {user ? (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="block w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <button
            onClick={() => router.push('/auth/login')}
            className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>

      {/* Status Log */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Status Log:</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {status.length === 0 ? (
            <p>No actions yet...</p>
          ) : (
            status.map((msg, i) => <div key={i}>{msg}</div>)
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Check Auth Cookies" to see current auth state</li>
          <li>Click "Logout" to sign out (should clear all cookies)</li>
          <li>After logout, you'll be redirected to login page</li>
          <li>Login with a different account</li>
          <li>Check if the new account works properly</li>
        </ol>
      </div>
    </div>
  );
}