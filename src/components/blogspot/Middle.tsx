// src/components/blogspot/Middle.tsx
"use client";

import React, { useState, useMemo, useCallback, CSSProperties } from 'react';
import { Loader2 } from 'lucide-react';
import { useGlobalBasePosts } from '@/hooks/useSpot';
import PostCard from '@/app/blog/card/PostCard'; // Updated import path

interface MiddleProps {
  searchQuery?: string;
  filters?: FilterOptions;
  onCreatePost?: () => void;
}

interface FilterOptions {
  dateRange?: 'all' | 'today' | 'week' | 'month';
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  category?: string;
  hasMedia?: boolean;
}

const Middle: React.FC<MiddleProps> = ({ searchQuery = '', filters = {}, onCreatePost }) => {
  const { data: posts, isLoading, isError, error, refetch } = useGlobalBasePosts();
  const [messages] = useState({ success: '', error: '' });

  // Memoize filters to prevent unnecessary recalculations
  const memoizedFilters = useMemo(() => filters, [filters]);

  // Memoized retry function
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized create post handler
  const handleCreatePost = useCallback(() => {
    if (onCreatePost) {
      onCreatePost();
    }
  }, [onCreatePost]);

  // Filter and sort posts based on props
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let filteredPosts = [...posts];

    // Apply search filter
    if (searchQuery) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (memoizedFilters.dateRange && memoizedFilters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (memoizedFilters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filteredPosts = filteredPosts.filter(post => 
        new Date(post.created_at) >= filterDate
      );
    }

    // Apply category filter
    if (memoizedFilters.category) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(memoizedFilters.category!.toLowerCase()) ||
        post.content.toLowerCase().includes(memoizedFilters.category!.toLowerCase())
      );
    }

    // Apply media filter
    if (memoizedFilters.hasMedia) {
      filteredPosts = filteredPosts.filter(post =>
        post.postImagePost.length > 0 ||
        post.postVideoPost.length > 0 ||
        post.postAudioPost.length > 0 ||
        post.postFilePost.length > 0
      );
    }

    // Apply sorting
    switch (memoizedFilters.sortBy) {
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'popular':
        filteredPosts.sort((a, b) => {
          const aMediaCount = a.postImagePost.length + a.postVideoPost.length + a.postAudioPost.length + a.postFilePost.length;
          const bMediaCount = b.postImagePost.length + b.postVideoPost.length + b.postAudioPost.length + b.postFilePost.length;
          return bMediaCount - aMediaCount;
        });
        break;
      case 'trending':
        filteredPosts.sort((a, b) => {
          const aScore = (a.postImagePost.length + a.postVideoPost.length + a.postAudioPost.length + a.postFilePost.length) * 
                        (new Date().getTime() - new Date(a.created_at).getTime());
          const bScore = (b.postImagePost.length + b.postVideoPost.length + b.postAudioPost.length + b.postFilePost.length) * 
                        (new Date().getTime() - new Date(b.created_at).getTime());
          return aScore - bScore;
        });
        break;
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filteredPosts;
  }, [posts, searchQuery, memoizedFilters]);

  // Enhanced Loading Component
  const LoadingSpinner = useCallback(() => (
    <div style={styles.loadingContainer}>
      <Loader2 size={48} style={styles.spinner} />
      <p style={styles.loadingText}>Loading posts...</p>
    </div>
  ), []);

  // Enhanced Empty State Component
  const EmptyState = useCallback(() => {
    const hasFilters = searchQuery || 
                       (memoizedFilters.dateRange && memoizedFilters.dateRange !== 'all') ||
                       (memoizedFilters.sortBy && memoizedFilters.sortBy !== 'newest') ||
                       memoizedFilters.category ||
                       memoizedFilters.hasMedia;

    if (hasFilters) {
      return (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyContent}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No posts match your filters</h3>
            <p style={styles.emptyText}>
              Try adjusting your search criteria or filters to find more posts.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyContent}>
          <div style={styles.emptyIcon}>📝</div>
          <h3 style={styles.emptyTitle}>No posts yet</h3>
          <p style={styles.emptyText}>
            Start sharing your thoughts by creating your first blog post.
          </p>
          {onCreatePost && (
            <button 
              onClick={handleCreatePost}
              style={styles.emptyCreateButton}
            >
              Create Your First Post
            </button>
          )}
        </div>
      </div>
    );
  }, [searchQuery, memoizedFilters, onCreatePost, handleCreatePost]);

  // Enhanced Error Component
  const ErrorDisplay = useCallback(() => (
    <div style={styles.errorContainer}>
      <div style={styles.errorContent}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Something went wrong</h3>
        <p style={styles.errorText}>{error?.message || 'Failed to load posts'}</p>
        <button onClick={handleRetry} style={styles.retryButton}>
          🔄 Try Again
        </button>
      </div>
    </div>
  ), [error?.message, handleRetry]);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        {LoadingSpinner()}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div style={styles.container}>
        {ErrorDisplay()}
      </div>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div style={styles.container}>
        {EmptyState()}
      </div>
    );
  }

  // No results after filtering
  if (filteredAndSortedPosts.length === 0) {
    return (
      <div style={styles.container}>
        {EmptyState()}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Results Header */}
      <div style={styles.resultsHeader}>
        <div style={styles.resultsInfo}>
          <h2 style={styles.resultsTitle}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Posts'}
          </h2>
          <p style={styles.resultsCount}>
            Showing {filteredAndSortedPosts.length} of {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Sort indicator */}
        {memoizedFilters.sortBy && memoizedFilters.sortBy !== 'newest' && (
          <div style={styles.sortIndicator}>
            Sorted by: <span style={styles.sortValue}>{memoizedFilters.sortBy}</span>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {messages.success && (
        <div style={styles.successMessage}>
          <p style={styles.messageText}>✅ {messages.success}</p>
        </div>
      )}
      {messages.error && (
        <div style={styles.errorMessage}>
          <p style={styles.messageText}>❌ {messages.error}</p>
        </div>
      )}

      {/* Posts Container */}
      <div style={styles.postsContainer}>
        {filteredAndSortedPosts.map((post, index) => (
          <div key={post.uuid} style={styles.postWrapper}>
            <PostCard post={post} />
            {/* Add pagination indicator every 5 posts */}
            {(index + 1) % 5 === 0 && index < filteredAndSortedPosts.length - 1 && (
              <div style={styles.paginationIndicator}>
                <span>Page {Math.floor((index + 1) / 5) + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button (if you want to implement pagination) */}
      {filteredAndSortedPosts.length >= 10 && (
        <div style={styles.loadMoreContainer}>
          <button style={styles.loadMoreButton}>
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    height: '100%',
    backgroundColor: '#fafafa',
    overflowY: 'auto',
    padding: '0 8px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  resultsInfo: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  resultsCount: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  sortIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
  },
  sortValue: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    color: '#3b82f6',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#6b7280',
    margin: 0,
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px',
  },
  emptyContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  emptyCreateButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '20px',
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: '8px',
  },
  errorText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '40px',
  },
  postWrapper: {
    position: 'relative',
  },
  paginationIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    margin: '20px 0',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
  },
  loadMoreButton: {
    padding: '12px 32px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
  },
  successMessage: {
    marginBottom: '24px',
    padding: '16px 20px',
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)',
  },
  errorMessage: {
    marginBottom: '24px',
    padding: '16px 20px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#065f46',
  },
};

export default Middle;