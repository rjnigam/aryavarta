'use client';

import { useEffect } from 'react';

interface ArticleViewTrackerProps {
  articleSlug: string;
}

export function ArticleViewTracker({ articleSlug }: ArticleViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('aryavarta_authenticated') === 'true';
      const email = localStorage.getItem('aryavarta_email');

      if (!isAuthenticated || !email) {
        return; // Don't track views for non-authenticated users
      }

      try {
        await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            articleSlug,
          }),
        });
      } catch (error) {
        console.error('Failed to track article view:', error);
      }
    };

    // Track view after a short delay to ensure it's an actual read
    const timer = setTimeout(trackView, 3000);
    return () => clearTimeout(timer);
  }, [articleSlug]);

  return null; // This component doesn't render anything
}
