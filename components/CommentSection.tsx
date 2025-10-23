'use client';

import { useState } from 'react';
import { MessageCircle, Send, BookOpen, Lock } from 'lucide-react';
import Link from 'next/link';

export function CommentSection() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ username: string; comment: string; date: string }>>([]);
  // In Phase 2, this will check real authentication status
  const [isAuthenticated] = useState(false);

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
      <div className="mb-12 bg-gradient-to-br from-saffron-50 to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-600 to-vermillion-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <BookOpen className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Aryavarta</h3>
            <p className="text-gray-700 leading-relaxed">
              Dedicated to making ancient Indian wisdom accessible and relevant to modern life. Each article is thoroughly 
              researched from authentic <span className="font-devanagari">श्रुति</span> and <span className="font-devanagari">स्मृति</span> sources 
              with deep respect for our <span className="font-devanagari">सनातन परंपरा</span> (eternal tradition).
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
      ) : (
        <div className="bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-xl p-8 border-2 border-saffron-200 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-vermillion-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-saffron-700" size={28} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif">
            Subscribe to Join the Discussion
          </h4>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Only subscribers can comment on articles. This helps us maintain quality discussions and reduce spam. 
            When you subscribe, we'll generate a unique username for you to use in comments.
          </p>
          <Link 
            href="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg"
          >
            Subscribe to Aryavarta
          </Link>
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
