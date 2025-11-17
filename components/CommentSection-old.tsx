'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, BookOpen, Lock, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CommentSectionProps {
  author: string;
  authorLocation?: string;
  authorImage?: string;
}

export function CommentSection({ author, authorLocation = 'Texas, United States', authorImage = '/authors/rajath-nigam.jpg' }: CommentSectionProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ username: string; comment: string; date: string }>>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [username, setUsername] = useState<string>('');
  // In Phase 2, this will be replaced with real authentication
  const [isAuthenticated] = useState(false);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = () => {
      const subscriptionStatus = localStorage.getItem('aryavarta_subscribed');
      const storedUsername = localStorage.getItem('aryavarta_username');
      setIsSubscribed(subscriptionStatus === 'true');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    checkSubscription();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    const newComment = {
      username: 'User123', // In Phase 2: This will be the generated username from subscription
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    };

    setComments([newComment, ...comments]);
    setComment('');
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-saffron-200">
      {/* Author Bio Section */}
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

      {/* Discussion Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="text-saffron-700" size={32} />
        <h3 className="text-2xl font-bold text-gray-900 font-serif">
          Discussion & Reflections
        </h3>
      </div>

      {/* Comment Form - Requires Authentication */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-6 border-2 border-saffron-200 mb-8">
          <div className="mb-4">
            <textarea
              placeholder="Share your thoughts, questions, or reflections..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
          >
            <Send size={18} />
            Post Comment
          </button>
          <p className="text-sm text-gray-500 mt-3 italic">
            Note: Comments are currently stored locally and will be integrated with a database soon.
          </p>
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
            When you subscribe, we&apos;ll generate a unique username for you to use in comments.
          </p>
          <Link 
            href="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
          >
            Subscribe to Aryavarta
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-700" size={28} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif">
            Thanks for Subscribing! 🎉
          </h4>
          
          {username && (
            <div className="bg-white rounded-lg p-4 mb-4 max-w-md mx-auto border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-2">Your Username:</p>
              <p className="text-2xl font-bold font-mono text-saffron-700">{username}</p>
              <p className="text-xs text-gray-500 mt-2">You&apos;ll use this to comment once the feature goes live!</p>
            </div>
          )}
          
          <p className="text-gray-600 mb-4 max-w-lg mx-auto">
            Comments are coming soon! We&apos;re working on integrating user authentication 
            so you can join the discussion with your unique username.
          </p>
          <p className="text-sm text-gray-500">
            You&apos;ll be notified via email when commenting goes live.
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-saffron-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{c.username}</h4>
                  <p className="text-sm text-gray-500">{c.date}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.comment}</p>
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
