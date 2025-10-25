'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChange, signOut as authSignOut } from '@/lib/supabaseAuth';

interface SessionUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  username: string;
  is_active: boolean;
  email_verified: boolean;
  subscribed_at?: string;
}

interface AuthContextType {
  user: SessionUser | null;
  subscriber: Subscriber | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(null);
        setSubscriber(null);
        return;
      }

      const data = await response.json();

      setUser(data.user ?? null);
      setSubscriber(data.subscriber ?? null);
    } catch (error) {
      // Silently handle auth errors for logged-out users
      console.debug('No active session:', error);
      setUser(null);
      setSubscriber(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for auth changes
    const { data: subscription } = onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser();
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSubscriber(null);
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setSubscriber(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, subscriber, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
