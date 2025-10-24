'use client';

import { BookOpen, LogIn, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  useEffect(() => {
    const authenticated = localStorage.getItem('aryavarta_authenticated') === 'true';
    const user = localStorage.getItem('aryavarta_username');
    setIsAuthenticated(authenticated);
    if (user) setUsername(user);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('aryavarta_authenticated', 'true');
      localStorage.setItem('aryavarta_email', data.user.email);
      localStorage.setItem('aryavarta_username', data.user.username);
      localStorage.setItem('aryavarta_subscribed', 'true');

      setIsAuthenticated(true);
      setUsername(data.user.username);
      setShowLoginModal(false);
      setLoginEmail('');
      
      // Refresh the page to update personalized content
      window.location.reload();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aryavarta_authenticated');
    localStorage.removeItem('aryavarta_email');
    localStorage.removeItem('aryavarta_username');
    setIsAuthenticated(false);
    setUsername('');
    window.location.reload();
  };
  
  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/articles', label: 'Articles' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-b border-saffron-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 6, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg transition-all"
          >
            <BookOpen className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-saffron-700 via-vermillion-700 to-sandalwood-700 bg-clip-text text-transparent font-serif group-hover:scale-105 transition-transform inline-block">
              आर्यवर्त
            </h1>
            <p className="text-xs text-gray-500 -mt-1 group-hover:text-saffron-600 transition-colors">Aryavarta</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link 
                href={item.href} 
                className={`relative text-gray-700 hover:text-saffron-700 transition font-medium group ${
                  isActive(item.href) ? 'text-saffron-700' : ''
                }`}
              >
                {item.label}
                <span 
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-saffron-600 to-vermillion-600 group-hover:w-full transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : ''
                  }`}
                />
              </Link>
            </motion.div>
          ))}
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                <UserCircle size={16} className="text-green-700" />
                <span className="text-sm font-mono font-semibold text-green-800">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition font-medium"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-saffron-700 hover:text-saffron-800 transition font-medium"
              >
                <LogIn size={16} />
                Login
              </button>
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-sm hover:shadow-md"
              >
                Subscribe
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Welcome Back! 🙏</h3>
            <p className="text-gray-600 mb-6">Login with your subscriber email to access personalized features</p>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                  required
                  disabled={isLoggingIn}
                />
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <LogIn size={18} />
                      </motion.div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Login
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginEmail('');
                    setLoginError('');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don&apos;t have an account yet?
              </p>
              <Link
                href="/subscribe"
                onClick={() => setShowLoginModal(false)}
                className="inline-flex items-center gap-2 text-sm text-saffron-700 hover:text-saffron-800 font-semibold"
              >
                Subscribe to Aryavarta →
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </motion.header>
  );
}
