'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Users, Send, Square } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

type LiveSessionProps = {
  sessionId: string;
  hostId: string;
  title: string;
  isHost: boolean;
};

export default function LiveSessionViewer({ 
  sessionId, 
  hostId, 
  title,
  isHost 
}: LiveSessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to real-time messages
  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('message_order', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Subscribe to viewer count updates
  useEffect(() => {
    const fetchViewerCount = async () => {
      const { count } = await supabase
        .from('session_viewers')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .is('left_at', null);

      if (count !== null) {
        setViewerCount(count);
      }
    };

    fetchViewerCount();

    const channel = supabase
      .channel(`viewers:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_viewers',
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          fetchViewerCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Handle asking a question (streaming)
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isStreaming) return;

    setIsStreaming(true);
    setStreamingMessage('');
    const currentQuestion = question;
    setQuestion('');

    try {
      const response = await fetch('/api/sessions/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question: currentQuestion,
          ai_model: 'perplexity',
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsStreaming(false);
              setStreamingMessage('');
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setStreamingMessage((prev) => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setIsStreaming(false);
    }
  };

  // Handle ending session
  const handleEndSession = async () => {
    if (!confirm('Are you sure you want to end this session?')) return;

    try {
      const response = await fetch('/api/sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          host_id: hostId,
        }),
      });

      if (response.ok) {
        alert('Session ended successfully!');
        window.location.href = '/'; // Redirect to home
      }
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end session');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-red-500">LIVE</span>
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <span>{viewerCount} watching</span>
            </div>
            {isHost && (
              <button
                onClick={handleEndSession}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Square size={16} />
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 max-h-[600px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-50 dark:bg-blue-900 ml-12'
                : 'bg-gray-50 dark:bg-gray-700 mr-12'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="font-semibold text-sm">
                {msg.role === 'user' ? '👤 You' : '🤖 AI'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {/* Streaming message */}
        {isStreaming && streamingMessage && (
          <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 mr-12">
            <div className="flex items-start gap-2">
              <div className="font-semibold text-sm">🤖 AI</div>
              <div className="text-sm text-gray-500">Typing...</div>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{streamingMessage}</p>
            <div className="mt-2 text-gray-500 text-sm animate-pulse">▊</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Input (Only for host) */}
      {isHost && (
        <form onSubmit={handleAskQuestion} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about Vedic philosophy..."
              disabled={isStreaming}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!question.trim() || isStreaming}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isStreaming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Streaming...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Ask
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Viewer mode message */}
      {!isHost && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md p-4 text-center">
          <MessageCircle className="inline-block mr-2" size={20} />
          <span>You're watching this live research session</span>
        </div>
      )}
    </div>
  );
}
