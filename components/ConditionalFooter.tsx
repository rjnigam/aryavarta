'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function ConditionalFooter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('aryavarta_authenticated') === 'true';
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  // Show loading skeleton
  if (isLoading) {
    return (
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif">आर्यवर्त</span>
                <p className="text-xs text-gray-400">Aryavarta</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 font-serif italic">
              नमस्ते • Bringing ancient wisdom to modern life, one insight at a time.
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Aryavarta. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2 font-serif">आर्यवर्त</h3>
            <p className="text-sm">Ancient Philosophy for Modern Minds</p>
          </div>
          <p className="text-sm mb-6">
            Sharing timeless wisdom from ancient Indian philosophy
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <Link href="/" className="hover:text-saffron-400 transition">Home</Link>
            <Link href="/about" className="hover:text-saffron-400 transition">About</Link>
            <Link href="/articles" className="hover:text-saffron-400 transition">Articles</Link>
            {!isAuthenticated && (
              <Link href="/subscribe" className="hover:text-saffron-400 transition">Subscribe</Link>
            )}
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Aryavarta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
