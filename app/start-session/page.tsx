'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Radio, Sparkles } from 'lucide-react';

export default function StartSessionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to start a session');
        setIsCreating(false);
        return;
      }

      // Create new session
      const response = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic: topic || null,
          ai_model: 'perplexity',
          host_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session');
      }

      // Redirect to the new session
      router.push(`/session/${data.session.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start session. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Radio className="text-red-500" size={32} />
            <h1 className="text-4xl font-bold">Start Live Research Session</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Ask questions, get AI-powered research with citations, and share your journey with followers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleStartSession} className="space-y-6">
            {/* Session Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Session Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Understanding Karma in Bhagavad Gita"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Topic (Optional) */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Vedic Philosophy, Dharma, Meditation"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* AI Model Info */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="text-blue-500 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold mb-1">Powered by Perplexity AI</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get research-backed answers with automatic citations and sources. 
                    Perfect for deep dives into Vedic wisdom and philosophical questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  <Radio size={20} />
                  Go Live
                </>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">💡 Tips for a Great Session:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Choose a focused, specific topic</li>
              <li>• Prepare 3-5 key questions to explore</li>
              <li>• Let followers watch your research journey in real-time</li>
              <li>• Save the session as a post when you're done</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
