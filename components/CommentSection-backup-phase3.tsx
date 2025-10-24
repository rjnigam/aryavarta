'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, BookOpen, Lock, MapPin, CheckCircle, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Comment {
  id: string;
  username: string;
  comment_text: string;
  created_at: string;
}

interface CommentSectionProps {
  articleSlug: string;
  author: string;
  authorLocation?: string;
  authorImage?: string;
}

export function CommentSection({ articleSlug, author, authorLocation = 'Texas, United States', authorImage = '/authors/rajath-nigam.jpg' }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Auth state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const checkAuthStatus = useCallback(() => {
    const subscribed = localStorage.getItem('aryavarta_subscribed') === 'true';
    const email = localStorage.getItem('aryavarta_email');
    const user = localStorage.getItem('aryavarta_username');
    const authenticated = localStorage.getItem('aryavarta_authenticated') === 'true';

    setIsSubscribed(subscribed);
    setIsAuthenticated(authenticated && !!email && !!user);
    
    if (email) setUserEmail(email);
    if (user) setUsername(user);
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments/${articleSlug}`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [articleSlug]);

  // Load comments and check auth on mount and when dependencies change
  useEffect(() => {
    loadComments();
    checkAuthStatus();
  }, [loadComments, checkAuthStatus]);

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

      // Store auth data
      localStorage.setItem('aryavarta_authenticated', 'true');
      localStorage.setItem('aryavarta_email', data.user.email);
      localStorage.setItem('aryavarta_username', data.user.username);
      localStorage.setItem('aryavarta_subscribed', 'true');

      setIsAuthenticated(true);
      setUserEmail(data.user.email);
      setUsername(data.user.username);
      setShowLoginForm(false);
      setLoginEmail('');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${articleSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          username: username,
          commentText: commentText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment');
      }

      // Refresh comments
      await loadComments();
      setCommentText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-saffron-200">
      {/* Author Bio */}
      <div className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-6 border-2 border-saffron-200 mb-12">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full flex-shrink-0 overflow-hidden shadow-lg ring-2 ring-saffron-200">
            <Image
              src={authorImage}
              alt={author}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">
              {author}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-1.5">
              <MapPin size={14} className="text-saffron-600" />
              {authorLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Discussion Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-saffron-700" size={32} />
          <h3 className="text-2xl font-bold text-gray-900 font-serif">
            Discussion & Reflections
          </h3>
        </div>
        {isAuthenticated && (
          <div className="text-sm text-gray-600">
            Commenting as <span className="font-mono font-semibold text-saffron-700">{username}</span>
          </div>
        )}
      </div>

      {/* Comment Form / Auth Prompts */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-6 border-2 border-saffron-200 mb-8">
          <div className="mb-4">
            <textarea
              placeholder="Share your thoughts, questions, or reflections..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white resize-none"
              required
              maxLength={2000}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {commentText.length} / 2000 characters
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Posting...
              </>
            ) : (
              <>
                <Send size={18} />
                Post Comment
              </>
            )}
          </button>
        </form>
      ) : !isSubscribed ? (
        <div className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-vermillion-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-saffron-700" size={28} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif">
            Subscribe to Join the Discussion
          </h4>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Only subscribers can comment on articles. This helps us maintain quality discussions and reduce spam.
          </p>
          <Link 
            href="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
          >
            Subscribe to Aryavarta
          </Link>
        </div>
      ) : showLoginForm ? (
        <form onSubmit={handleLogin} className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 mb-8">
          <h4 className="text-xl font-bold text-gray-900 mb-4 font-serif text-center">
            Login to Comment
          </h4>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Enter your subscriber email to start commenting
          </p>
          <div className="mb-4">
            <input
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
            <p className="text-sm text-red-600 mb-3">{loginError}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
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
                setShowLoginForm(false);
                setLoginEmail('');
                setLoginError('');
              }}
              className="px-6 py-3 border-2 border-saffron-300 text-saffron-700 rounded-lg font-semibold hover:bg-saffron-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-700" size={28} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif">
            Welcome Back, Subscriber! 🙏
          </h4>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Login with your subscriber email to start commenting
          </p>
          <button
            onClick={() => setShowLoginForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
          >
            <LogIn size={18} />
            Login to Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-saffron-600" size={32} />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </p>
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg p-6 border border-saffron-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 font-mono">{c.username}</h4>
                  <p className="text-sm text-gray-500">{formatDate(c.created_at)}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{c.comment_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-saffron-50 to-sandalwood-50 rounded-lg border-2 border-dashed border-saffron-300">
          <MessageCircle className="mx-auto mb-3 text-saffron-400" size={48} />
          <p className="text-gray-600 font-serif">
            Be the first to share your thoughts on this article
          </p>
        </div>
      )}
    </div>
  );
}
