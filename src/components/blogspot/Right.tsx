// src/components/blogspot/Right.tsx
"use client";

import React, { useMemo, CSSProperties } from 'react';
import { 
  BarChart3, 
  FileText, 
  Image, 
  Video, 
  Music, 
  File,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  Eye,
  Heart
} from 'lucide-react';
import { useGlobalBasePosts } from '@/hooks/useSpot';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = '#3b82f6',
  trend 
}) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={styles.statHeader}>
      <div style={{ ...styles.statIcon, backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div style={styles.statInfo}>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statTitle}>{title}</div>
        {subtitle && <div style={styles.statSubtitle}>{subtitle}</div>}
      </div>
    </div>
    {trend && (
      <div style={styles.statTrend}>
        <span style={{
          ...styles.trendValue,
          color: trend.isPositive ? '#10b981' : '#ef4444'
        }}>
          {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
        </span>
        <span style={styles.trendLabel}>vs last month</span>
      </div>
    )}
  </div>
);

const Right: React.FC = () => {
  const { data: posts, isLoading } = useGlobalBasePosts();

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!posts) return null;

    const totalPosts = posts.length;
    const totalImages = posts.reduce((sum, post) => sum + post.postImagePost.length, 0);
    const totalVideos = posts.reduce((sum, post) => sum + post.postVideoPost.length, 0);
    const totalAudios = posts.reduce((sum, post) => sum + post.postAudioPost.length, 0);
    const totalFiles = posts.reduce((sum, post) => sum + post.postFilePost.length, 0);
    const totalMedia = totalImages + totalVideos + totalAudios + totalFiles;

    // Posts with media
    const postsWithMedia = posts.filter(post => 
      post.postImagePost.length > 0 || 
      post.postVideoPost.length > 0 || 
      post.postAudioPost.length > 0 || 
      post.postFilePost.length > 0
    ).length;

    // Recent posts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentPosts = posts.filter(post => 
      new Date(post.created_at) >= sevenDaysAgo
    ).length;

    // Activity by day of week
    const dayActivity = new Array(7).fill(0);
    posts.forEach(post => {
      const dayOfWeek = new Date(post.created_at).getDay();
      dayActivity[dayOfWeek]++;
    });

    // Most active day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostActiveDay = dayNames[dayActivity.indexOf(Math.max(...dayActivity))];

    // Average media per post
    const avgMediaPerPost = totalPosts > 0 ? (totalMedia / totalPosts).toFixed(1) : '0';

    return {
      totalPosts,
      totalImages,
      totalVideos,
      totalAudios,
      totalFiles,
      totalMedia,
      postsWithMedia,
      recentPosts,
      mostActiveDay,
      avgMediaPerPost,
      dayActivity
    };
  }, [posts]);

  // Recent activity
  const recentActivity = useMemo(() => {
    if (!posts) return [];
    
    return posts
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.uuid,
        title: post.title,
        date: new Date(post.created_at),
        mediaCount: post.postImagePost.length + post.postVideoPost.length + 
                   post.postAudioPost.length + post.postFilePost.length
      }));
  }, [posts]);

  // Top posts by media count
  const topPostsByMedia = useMemo(() => {
    if (!posts) return [];
    
    return posts
      .map(post => ({
        id: post.uuid,
        title: post.title,
        mediaCount: post.postImagePost.length + post.postVideoPost.length + 
                   post.postAudioPost.length + post.postFilePost.length
      }))
      .filter(post => post.mediaCount > 0)
      .sort((a, b) => b.mediaCount - a.mediaCount)
      .slice(0, 5);
  }, [posts]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>⟳</div>
          <p style={styles.loadingText}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <BarChart3 size={20} />
          Statistics
        </h2>
      </div>

      {/* Overview Stats */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Overview</h3>
        <div style={styles.statsGrid}>
          <StatCard
            icon={<FileText size={20} />}
            title="Total Posts"
            value={statistics.totalPosts}
            color="#3b82f6"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatCard
            icon={<Activity size={20} />}
            title="Recent Posts"
            value={statistics.recentPosts}
            subtitle="Last 7 days"
            color="#10b981"
          />
        </div>
      </div>

      {/* Media Statistics */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Media Content</h3>
        <div style={styles.statsGrid}>
          <StatCard
            icon={<Image size={18} />}
            title="Images"
            value={statistics.totalImages}
            color="#f59e0b"
          />
          
          <StatCard
            icon={<Video size={18} />}
            title="Videos"
            value={statistics.totalVideos}
            color="#ef4444"
          />
          
          <StatCard
            icon={<Music size={18} />}
            title="Audio"
            value={statistics.totalAudios}
            color="#8b5cf6"
          />
          
          <StatCard
            icon={<File size={18} />}
            title="Files"
            value={statistics.totalFiles}
            color="#6b7280"
          />
        </div>
        
        <div style={styles.mediaOverview}>
          <div style={styles.mediaOverviewItem}>
            <span style={styles.mediaOverviewLabel}>Total Media Items:</span>
            <span style={styles.mediaOverviewValue}>{statistics.totalMedia}</span>
          </div>
          <div style={styles.mediaOverviewItem}>
            <span style={styles.mediaOverviewLabel}>Posts with Media:</span>
            <span style={styles.mediaOverviewValue}>
              {statistics.postsWithMedia}/{statistics.totalPosts}
            </span>
          </div>
          <div style={styles.mediaOverviewItem}>
            <span style={styles.mediaOverviewLabel}>Avg Media per Post:</span>
            <span style={styles.mediaOverviewValue}>{statistics.avgMediaPerPost}</span>
          </div>
        </div>
      </div>

      {/* Activity Insights */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Activity Insights</h3>
        <div style={styles.insightCard}>
          <div style={styles.insightItem}>
            <TrendingUp size={16} style={{ color: '#10b981' }} />
            <span>Most active day: <strong>{statistics.mostActiveDay}</strong></span>
          </div>
          <div style={styles.insightItem}>
            <Clock size={16} style={{ color: '#3b82f6' }} />
            <span>Publishing frequency: <strong>
              {(statistics.totalPosts / Math.max(1, 7)).toFixed(1)} posts/week
            </strong></span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>
                    {activity.title.length > 30 
                      ? `${activity.title.substring(0, 30)}...` 
                      : activity.title
                    }
                  </div>
                  <div style={styles.activityMeta}>
                    <span style={styles.activityDate}>
                      {activity.date.toLocaleDateString()}
                    </span>
                    {activity.mediaCount > 0 && (
                      <span style={styles.activityMedia}>
                        {activity.mediaCount} media
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyActivity}>No recent activity</div>
          )}
        </div>
      </div>

      {/* Top Posts */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Top Posts by Media</h3>
        <div style={styles.topPostsList}>
          {topPostsByMedia.length > 0 ? (
            topPostsByMedia.map((post, index) => (
              <div key={post.id} style={styles.topPostItem}>
                <div style={styles.topPostRank}>#{index + 1}</div>
                <div style={styles.topPostContent}>
                  <div style={styles.topPostTitle}>
                    {post.title.length > 25 
                      ? `${post.title.substring(0, 25)}...` 
                      : post.title
                    }
                  </div>
                  <div style={styles.topPostMedia}>
                    {post.mediaCount} media items
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyActivity}>No posts with media yet</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.quickActions}>
          <button style={styles.quickActionButton}>
            <Eye size={16} />
            View Analytics
          </button>
          <button style={styles.quickActionButton}>
            <Heart size={16} />
            Popular Posts
          </button>
          <button style={styles.quickActionButton}>
            <Calendar size={16} />
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f3f4f6',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  statCard: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  statIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1',
  },
  statTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginTop: '2px',
  },
  statSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '2px',
  },
  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #e5e7eb',
  },
  trendValue: {
    fontSize: '12px',
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  mediaOverview: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
  },
  mediaOverviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  mediaOverviewLabel: {
    fontSize: '13px',
    color: '#6b7280',
  },
  mediaOverviewValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
  },
  insightCard: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#374151',
  },
  activityList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  activityItem: {
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  activityContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    lineHeight: '1.3',
  },
  activityMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activityDate: {
    fontSize: '12px',
    color: '#6b7280',
  },
  activityMedia: {
    fontSize: '12px',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  emptyActivity: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
    color: '#9ca3af',
  },
  topPostsList: {
    maxHeight: '180px',
    overflowY: 'auto',
  },
  topPostItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  topPostRank: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  topPostContent: {
    flex: 1,
    minWidth: 0,
  },
  topPostTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    lineHeight: '1.3',
  },
  topPostMedia: {
    fontSize: '12px',
    color: '#6b7280',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  quickActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  loadingSpinner: {
    fontSize: '24px',
    animation: 'spin 1s linear infinite',
    marginBottom: '12px',
    color: '#3b82f6',
  },
  loadingText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#9ca3af',
    textAlign: 'center',
  },
};

export default Right;