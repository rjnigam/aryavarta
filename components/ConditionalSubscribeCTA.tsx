'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface ConditionalSubscribeCTAProps {
  variant?: 'default' | 'journey';
}

export function ConditionalSubscribeCTA({ variant = 'default' }: ConditionalSubscribeCTAProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('aryavarta_authenticated') === 'true';
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  // Don't show anything while checking auth status
  if (isLoading) {
    return null;
  }

  // Don't show CTA if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  const content = variant === 'journey' ? {
    badge: 'Join Our Community',
    title: 'Join Our Journey',
    description: 'Receive weekly insights from ancient Indian philosophy, delivered to your inbox every week.',
  } : {
    badge: 'Join Our Community',
    title: 'Never Miss an Article',
    description: 'Get weekly insights delivered to your inbox. Join our community of seekers.',
  };

  // Show subscribe CTA for non-authenticated users
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-saffron-600 via-vermillion-600 to-sandalwood-600 rounded-2xl p-12 text-white text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">{content.badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            {content.title}
          </h2>
          <p className="text-xl mb-8 opacity-95">
            {content.description}
          </p>
          <Link 
            href="/subscribe"
            className="inline-block bg-white text-saffron-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Subscribe to Aryavarta
          </Link>
        </div>
      </div>
    </section>
  );
}
