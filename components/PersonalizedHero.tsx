'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
}

export function PersonalizedHero() {
  const { user, subscriber, loading: authLoading } = useAuth();
  const [unreadArticle, setUnreadArticle] = useState<Article | null>(null);
  const [readCount, setReadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUnreadArticles = async () => {
      if (!user || !subscriber) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/unread-articles?email=${encodeURIComponent(subscriber.email)}`);
        
        if (!response.ok) {
          console.error('API error:', response.status);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data.unreadArticles && data.unreadArticles.length > 0) {
          // Get a random unread article
          const randomIndex = Math.floor(Math.random() * data.unreadArticles.length);
          setUnreadArticle(data.unreadArticles[randomIndex]);
        }

        setReadCount(data.readCount || 0);
        setTotalCount(data.totalArticles || 0);
      } catch (error) {
        console.error('Failed to load unread articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadUnreadArticles();
    }
  }, [user, subscriber, authLoading]);

  // Show default hero for non-authenticated users or while loading
  if (!user || !subscriber || isLoading || authLoading) {
    return (
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-saffron-100 via-white to-sandalwood-100 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-vermillion-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-saffron-100 to-sandalwood-100 rounded-full mb-6 shadow-sm border border-saffron-200">
            <Sparkles className="text-saffron-700" size={18} />
            <span className="text-sm font-semibold text-saffron-800">
              सनातन ज्ञान • Ancient Wisdom for Modern Times
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Ancient Philosophy for </span>
            <span className="bg-gradient-to-r from-vermillion-600 via-saffron-600 to-sandalwood-600 bg-clip-text text-transparent">
              Modern Minds
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            In an age of unprecedented comfort yet persistent emptiness, rediscover the philosophical wisdom that helps us lead meaningful lives — free from dogma, rich in insight.
          </p>

          {!isLoading && !authLoading && !user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-xl font-semibold text-lg hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <BookOpen size={22} />
                Subscribe to Aryavarta
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-saffron-300 text-saffron-700 rounded-xl font-semibold text-lg hover:bg-saffron-50 transition-all shadow-md"
              >
                Browse Articles
              </Link>
            </div>
          )}
          
          {!isLoading && !authLoading && user && (
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-xl font-semibold text-lg hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <BookOpen size={22} />
              Browse Articles
            </Link>
          )}
        </div>
      </section>
    );
  }

  // Show personalized hero for authenticated users with unread content
  if (unreadArticle) {
    const formattedDate = new Date(unreadArticle.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-saffron-100 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Welcome Back Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4 shadow-sm border border-green-200">
              <CheckCircle className="text-green-700" size={18} />
              <span className="text-sm font-semibold text-green-800">
                Welcome back, {subscriber.username}! 🙏
              </span>
            </div>
            <p className="text-gray-600">
              You&apos;ve read {readCount} of {totalCount} articles
            </p>
          </div>

          {/* Recommended Article Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-saffron-200">
            <div className="flex items-center gap-2 text-sm text-saffron-700 mb-4">
              <Sparkles size={16} />
              <span className="font-semibold">Recommended for you</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight font-serif">
              {unreadArticle.title}
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {unreadArticle.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full font-medium">
                  {unreadArticle.category}
                </span>
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/articles/${unreadArticle.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
              >
                <BookOpen size={18} />
                Read Article
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-saffron-300 text-saffron-700 rounded-lg font-semibold hover:bg-saffron-50 transition-all"
              >
                Browse All Articles
              </Link>
            </div>
          </div>

          {/* Progress indicator */}
          {readCount > 0 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-saffron-600 to-vermillion-600 transition-all"
                    style={{ width: `${(readCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="font-medium">{Math.round((readCount / totalCount) * 100)}%</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // No unread articles or default state for authenticated users
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-saffron-100 opacity-60"></div>

      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6 shadow-sm border border-green-200">
          <CheckCircle className="text-green-700" size={18} />
          <span className="text-sm font-semibold text-green-800">
            Welcome back, {subscriber.username}! 🙏
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-serif">
          Explore Our Latest Articles
        </h2>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover timeless wisdom from ancient Indian philosophy
        </p>

        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-xl font-semibold text-lg hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-lg hover:shadow-xl"
        >
          <BookOpen size={22} />
          Browse Articles
        </Link>
      </div>
    </section>
  );
}
