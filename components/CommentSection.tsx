'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, BookOpen, Lock, MapPin, CheckCircle, Loader2, LogIn, Reply, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ArrowUpDown, Flag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Comment {
  id: string;
  username: string;
  email: string; // Author's email (needed to prevent self-reactions)
  comment_text: string;
  created_at: string;
  replies?: Comment[]; // Nested replies
  likeCount?: number;
  dislikeCount?: number;
  userReaction?: 'like' | 'dislike' | null;
  is_hidden?: boolean;
  hidden_reason?: string | null;
  moderation_status?: 'visible' | 'auto_hidden' | 'manual_hidden' | 'resolved';
}

interface CommentSectionProps {
  articleSlug: string;
  author: string;
  authorLocation?: string;
  authorImage?: string;
}

// Recursive component for rendering comments with replies
interface CommentWithRepliesProps {
  comment: Comment;
  depth: number;
  isAuthenticated: boolean;
  userEmail: string | null;
  replyingTo: string | null;
  replyText: string;
  isSubmitting: boolean;
  onReply: (id: string) => void;
  onCancelReply: () => void;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: (parentId: string) => void;
  onReaction: (commentId: string, reactionType: 'like' | 'dislike', commentAuthorEmail: string) => void;
  onReport: (commentId: string) => void;
  reportingCommentId: string | null;
  reportedCommentIds: Set<string>;
  formatDate: (date: string) => string;
  expandedThreads: Set<string>;
  onToggleThread: (commentId: string) => void;
}

function CommentWithReplies({
  comment,
  depth,
  isAuthenticated,
  userEmail,
  replyingTo,
  replyText,
  isSubmitting,
  onReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  onReaction,
  onReport,
  reportingCommentId,
  reportedCommentIds,
  formatDate,
  expandedThreads,
  onToggleThread,
}: CommentWithRepliesProps) {
  const isReplying = replyingTo === comment.id;
  const marginLeft = depth > 0 ? 'ml-8' : '';
  const isOwnComment = userEmail === comment.email;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isExpanded = expandedThreads.has(comment.id);
  const moderationStatus = comment.moderation_status;
  const isHidden =
    Boolean(comment.is_hidden) ||
    moderationStatus === 'auto_hidden' ||
    moderationStatus === 'manual_hidden';
  const hiddenReason = comment.hidden_reason;
  const hasUserReported = reportedCommentIds.has(comment.id);
  const isReporting = reportingCommentId === comment.id;

  return (
    <div className={`${marginLeft} ${depth > 0 ? 'mt-4' : ''}`}>
      <div className="bg-white rounded-lg p-6 border border-saffron-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 font-mono">{comment.username}</h4>
            <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
          </div>
        </div>
        {isHidden ? (
          <div className="text-sm text-gray-600 bg-saffron-50 border border-saffron-200 rounded-lg px-4 py-3 mb-4">
            <p className="font-semibold text-saffron-800">
              This comment is temporarily hidden pending moderator review.
            </p>
            {hiddenReason && (
              <p className="mt-1 text-gray-600">Reason: {hiddenReason}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{comment.comment_text}</p>
        )}
        
        {/* Reaction and Reply Buttons */}
        <div className="flex items-center gap-4">
          {/* Like/Dislike Buttons */}
          {isAuthenticated && !isOwnComment && !isHidden && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onReaction(comment.id, 'like', comment.email)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  comment.userReaction === 'like'
                    ? 'text-saffron-700'
                    : 'text-gray-500 hover:text-saffron-700'
                }`}
                title="Like this comment"
              >
                <ThumbsUp size={16} className={comment.userReaction === 'like' ? 'fill-current' : ''} />
                {comment.likeCount || 0}
              </button>
              <button
                onClick={() => onReaction(comment.id, 'dislike', comment.email)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  comment.userReaction === 'dislike'
                    ? 'text-red-600'
                    : 'text-gray-500 hover:text-red-600'
                }`}
                title="Dislike this comment"
              >
                <ThumbsDown size={16} className={comment.userReaction === 'dislike' ? 'fill-current' : ''} />
                {comment.dislikeCount || 0}
              </button>
            </div>
          )}
          
          {/* Show counts only for non-authenticated users or own comments */}
          {(!isAuthenticated || isOwnComment || isHidden) &&
            (comment.likeCount !== undefined || comment.dislikeCount !== undefined) && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <ThumbsUp size={16} />
                {comment.likeCount || 0}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ThumbsDown size={16} />
                {comment.dislikeCount || 0}
              </span>
            </div>
          )}
          
          {/* Reply Button */}
          {isAuthenticated && !isReplying && !isHidden && (
            <button
              onClick={() => onReply(comment.id)}
              className="inline-flex items-center gap-1.5 text-sm text-saffron-700 hover:text-saffron-900 font-semibold transition-colors"
            >
              <Reply size={16} />
              Reply
            </button>
          )}

          {isAuthenticated && !isOwnComment && !isHidden && (
            <button
              onClick={() => onReport(comment.id)}
              disabled={isReporting || hasUserReported}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                hasUserReported
                  ? 'text-saffron-600 cursor-default'
                  : 'text-gray-500 hover:text-saffron-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isReporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Flag size={16} className={hasUserReported ? 'text-saffron-600' : ''} />
              )}
              {hasUserReported ? 'Reported' : 'Report'}
            </button>
          )}
          
          {/* Expand/Collapse Thread Button */}
          {hasReplies && (
            <button
              onClick={() => onToggleThread(comment.id)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-semibold transition-colors ml-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} />
                  Hide {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 bg-gradient-to-br from-saffron-50 via-white to-sandalwood-50 rounded-lg p-4 border border-saffron-200">
            <textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white resize-none mb-3"
              required
              maxLength={2000}
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSubmitReply(comment.id)}
                disabled={isSubmitting || !replyText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-saffron-600 to-vermillion-600 text-white rounded-lg text-sm font-semibold hover:from-saffron-700 hover:to-vermillion-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Post Reply
                  </>
                )}
              </button>
              <button
                onClick={onCancelReply}
                disabled={isSubmitting}
                className="px-4 py-2 border border-saffron-300 text-saffron-700 rounded-lg text-sm font-semibold hover:bg-saffron-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && isExpanded && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentWithReplies
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              replyingTo={replyingTo}
              replyText={replyText}
              isSubmitting={isSubmitting}
              onReply={onReply}
              onCancelReply={onCancelReply}
              onReplyTextChange={onReplyTextChange}
              onSubmitReply={onSubmitReply}
              onReaction={onReaction}
              onReport={onReport}
              reportingCommentId={reportingCommentId}
              reportedCommentIds={reportedCommentIds}
              formatDate={formatDate}
              expandedThreads={expandedThreads}
              onToggleThread={onToggleThread}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ articleSlug, author, authorLocation = 'Texas, United States', authorImage = '/authors/rajath-nigam.jpg' }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // comment id being replied to
  const [replyText, setReplyText] = useState('');
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportedCommentIds, setReportedCommentIds] = useState<Set<string>>(() => new Set());
  
  // Auth state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Thread collapse/expand state
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'oldest'>('popular');

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

  // Recursively add reactions to comments and replies
  const addReactionsToComment = useCallback(async (comment: Comment, email: string): Promise<Comment> => {
    try {
      const reactionResponse = await fetch(
        `/api/comments/reactions?commentId=${encodeURIComponent(comment.id)}&userEmail=${encodeURIComponent(email || '')}`
      );
      
      if (!reactionResponse.ok) {
        console.error('Failed to fetch reactions:', await reactionResponse.text());
        // Return comment with zero counts if reaction fetch fails
        return {
          ...comment,
          likeCount: 0,
          dislikeCount: 0,
          userReaction: null,
          replies: comment.replies || [],
        };
      }
      
      const reactionData = await reactionResponse.json();
      
      let repliesWithReactions = comment.replies || [];
      if (comment.replies && comment.replies.length > 0) {
        repliesWithReactions = await Promise.all(
          comment.replies.map(reply => addReactionsToComment(reply, email))
        );
      }
      
      return {
        ...comment,
        likeCount: reactionData.likeCount || 0,
        dislikeCount: reactionData.dislikeCount || 0,
        userReaction: reactionData.userReaction || null,
        replies: repliesWithReactions,
      };
    } catch (err) {
      console.error('Failed to load reactions for comment:', comment.id, err);
      // Return comment with zero counts on error
      return {
        ...comment,
        likeCount: 0,
        dislikeCount: 0,
        userReaction: null,
        replies: comment.replies || [],
      };
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const fallbackEmail = localStorage.getItem('aryavarta_email') || '';
      const currentEmail = userEmail || fallbackEmail;

      const response = await fetch(`/api/comments/${articleSlug}`);
      const data = await response.json();
      const commentsData = data.comments || [];
      
      const commentsWithReactions = await Promise.all(
        commentsData.map(async (comment: Comment) => addReactionsToComment(comment, currentEmail))
      );
      
      setComments(commentsWithReactions);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addReactionsToComment, articleSlug, userEmail]);

  useEffect(() => {
    checkAuthStatus();
  }, [articleSlug, checkAuthStatus]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Helper function to update reactions in nested comments
  const updateCommentReaction = (
    comments: Comment[], 
    commentId: string, 
    reactionType: 'like' | 'dislike', 
    action: 'added' | 'removed' | 'updated',
    previousReaction: 'like' | 'dislike' | null
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        let likeCount = comment.likeCount || 0;
        let dislikeCount = comment.dislikeCount || 0;
        let userReaction = comment.userReaction;
        
        if (action === 'added') {
          // New reaction
          if (reactionType === 'like') {
            likeCount++;
            userReaction = 'like';
          } else {
            dislikeCount++;
            userReaction = 'dislike';
          }
        } else if (action === 'removed') {
          // Toggle off
          if (reactionType === 'like') {
            likeCount = Math.max(0, likeCount - 1);
          } else {
            dislikeCount = Math.max(0, dislikeCount - 1);
          }
          userReaction = null;
        } else if (action === 'updated') {
          // Switch from one to another
          if (previousReaction === 'like') {
            likeCount = Math.max(0, likeCount - 1);
            dislikeCount++;
          } else {
            dislikeCount = Math.max(0, dislikeCount - 1);
            likeCount++;
          }
          userReaction = reactionType;
        }
        
        return {
          ...comment,
          likeCount,
          dislikeCount,
          userReaction,
        };
      }
      
      // Recursively update nested replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentReaction(comment.replies, commentId, reactionType, action, previousReaction),
        };
      }
      
      return comment;
    });
  };

  const applyServerReactionState = (
    comments: Comment[],
    commentId: string,
    state: {
      likeCount?: number;
      dislikeCount?: number;
      moderation?: {
        isHidden: boolean;
        status?: Comment['moderation_status'];
        hiddenReason?: string | null;
      };
    }
  ): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        const nextStatus =
          state.moderation && state.moderation.status !== undefined
            ? state.moderation.status
            : comment.moderation_status;

        const nextHiddenReason =
          state.moderation && state.moderation.hiddenReason !== undefined
            ? state.moderation.hiddenReason
            : comment.hidden_reason;

        return {
          ...comment,
          likeCount: typeof state.likeCount === 'number' ? state.likeCount : comment.likeCount,
          dislikeCount:
            typeof state.dislikeCount === 'number' ? state.dislikeCount : comment.dislikeCount,
          is_hidden: state.moderation?.isHidden ?? comment.is_hidden,
          moderation_status: nextStatus,
          hidden_reason: nextHiddenReason,
        };
      }

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: applyServerReactionState(comment.replies, commentId, state),
        };
      }

      return comment;
    });
  };

  const handleReaction = async (commentId: string, reactionType: 'like' | 'dislike', commentAuthorEmail: string) => {
    if (!isAuthenticated || !userEmail) {
      alert('Please login to react to comments');
      return;
    }
    
    // Find the current comment and its reaction state
    const findComment = (comments: Comment[], id: string): Comment | null => {
      for (const comment of comments) {
        if (comment.id === id) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentComment = findComment(comments, commentId);
    if (!currentComment) return;
    
    const previousReaction = currentComment.userReaction || null;
    let expectedAction: 'added' | 'removed' | 'updated';
    
    if (!previousReaction) {
      expectedAction = 'added';
    } else if (previousReaction === reactionType) {
      expectedAction = 'removed';
    } else {
      expectedAction = 'updated';
    }
    
    // Optimistic update - update UI immediately
    setComments(prevComments => 
      updateCommentReaction(prevComments, commentId, reactionType, expectedAction, previousReaction)
    );
    
    try {
      const response = await fetch('/api/comments/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          userEmail,
          reactionType,
          commentAuthorEmail,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Revert optimistic update on error
        await loadComments();
        alert(data.message || 'Failed to react to comment');
        return;
      }

      const hasServerCounts = typeof data.likeCount === 'number' || typeof data.dislikeCount === 'number';
      const hasServerModeration = Boolean(data.moderation);

      if (hasServerCounts || hasServerModeration) {
        setComments(prevComments =>
          applyServerReactionState(prevComments, commentId, {
            likeCount: typeof data.likeCount === 'number' ? data.likeCount : undefined,
            dislikeCount: typeof data.dislikeCount === 'number' ? data.dislikeCount : undefined,
            moderation: data.moderation
              ? {
                  isHidden: Boolean(data.moderation.isHidden),
                  status: data.moderation.status ?? undefined,
                  hiddenReason:
                    data.moderation.hiddenReason !== undefined
                      ? data.moderation.hiddenReason
                      : undefined,
                }
              : undefined,
          })
        );
      }
      
      // Server responded successfully, but let's verify the counts match
      // by reloading from server after a short delay
      setTimeout(() => {
        loadComments();
      }, 1000);
    } catch (err) {
      console.error('Failed to react to comment:', err);
      // Revert optimistic update on error
      await loadComments();
      alert('Failed to react to comment');
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!isAuthenticated || !userEmail || !username) {
      alert('Please login to report comments');
      return;
    }

    if (reportedCommentIds.has(commentId)) {
      alert('You have already reported this comment');
      return;
    }

    const shouldReport = window.confirm('Report this comment as spam?');
    if (!shouldReport) {
      return;
    }

    setReportingCommentId(commentId);

    try {
      const response = await fetch('/api/comments/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          reporterEmail: userEmail,
          reporterUsername: username,
          reason: 'spam',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to report comment');
        return;
      }

      setReportedCommentIds((prev) => {
        const next = new Set(prev);
        next.add(commentId);
        return next;
      });

      if (data.moderation) {
        setComments((prevComments) =>
          applyServerReactionState(prevComments, commentId, {
            moderation: {
              isHidden: Boolean(data.moderation.isHidden),
              status: data.moderation.status ?? undefined,
              hiddenReason:
                data.moderation.hiddenReason !== undefined
                  ? data.moderation.hiddenReason
                  : null,
            },
          })
        );
      }

      if (data.moderation?.isHidden) {
        setTimeout(() => {
          loadComments();
        }, 500);
      }

      alert(data.message || 'Thanks for flagging this comment');
    } catch (err) {
      console.error('Failed to report comment:', err);
      alert('Failed to report comment');
    } finally {
      setReportingCommentId(null);
    }
  };

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

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim() || !isAuthenticated) return;

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${articleSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          username: username,
          commentText: replyText.trim(),
          parentCommentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post reply');
      }

      // Refresh comments
      await loadComments();
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply');
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
  
  const toggleThread = (commentId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };
  
  // Sort comments based on selected criteria
  const getSortedComments = (commentsToSort: Comment[]): Comment[] => {
    const sorted = [...commentsToSort];
    
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => {
          const aScore = (a.likeCount || 0) - (a.dislikeCount || 0);
          const bScore = (b.likeCount || 0) - (b.dislikeCount || 0);
          return bScore - aScore; // Higher score first
        });
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      default:
        return sorted;
    }
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
          {/* Sort controls and count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'oldest')}
                className="text-sm px-3 py-1.5 rounded-lg border border-saffron-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white text-gray-700 font-semibold cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          {getSortedComments(comments).map((c) => (
            <CommentWithReplies 
              key={c.id} 
              comment={c} 
              depth={0}
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              replyingTo={replyingTo}
              replyText={replyText}
              isSubmitting={isSubmitting}
              onReply={(id) => setReplyingTo(id)}
              onCancelReply={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
              onReplyTextChange={(text) => setReplyText(text)}
              onSubmitReply={handleSubmitReply}
              onReaction={handleReaction}
              onReport={handleReportComment}
              reportingCommentId={reportingCommentId}
              reportedCommentIds={reportedCommentIds}
              formatDate={formatDate}
              expandedThreads={expandedThreads}
              onToggleThread={toggleThread}
            />
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
