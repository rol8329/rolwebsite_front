// src/components/blogspot/Left.tsx
"use client";

import React, { useState, CSSProperties } from 'react';
import { Plus, Search, Filter, Calendar, Tag, Folder, TrendingUp, Clock } from 'lucide-react';

interface LeftProps {
  onCreatePost: () => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  dateRange?: 'all' | 'today' | 'week' | 'month';
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  category?: string;
  hasMedia?: boolean;
}

const Left: React.FC<LeftProps> = ({ onCreatePost, onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    sortBy: 'newest',
    category: '',
    hasMedia: false,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      dateRange: 'all',
      sortBy: 'newest',
      category: '',
      hasMedia: false,
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Tools & Filters</h2>
      </div>

      {/* Create Post Button */}
      <div style={styles.section}>
        <button onClick={onCreatePost} style={styles.createButton}>
          <Plus size={20} />
          <span>Create New Post</span>
        </button>
      </div>

      {/* Search */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Search size={16} />
          <span>Search Posts</span>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              style={styles.clearButton}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Filter size={16} />
          <span>Quick Filters</span>
        </div>
        
        {/* Date Range */}
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Date Range:</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange({ dateRange: e.target.value as any})}
            style={styles.select}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Sort By */}
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort By:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
            style={styles.select}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Has Media Filter */}
        <div style={styles.filterGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.hasMedia}
              onChange={(e) => handleFilterChange({ hasMedia: e.target.checked })}
              style={styles.checkbox}
            />
            <span>Posts with Media</span>
          </label>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div style={styles.section}>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={styles.toggleButton}
        >
          <Filter size={16} />
          <span>Advanced Filters</span>
          <span style={styles.toggleIcon}>
            {showAdvancedFilters ? '−' : '+'}
          </span>
        </button>

        {showAdvancedFilters && (
          <div style={styles.advancedFilters}>
            {/* Category Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category:</label>
              <input
                type="text"
                placeholder="Enter category..."
                value={filters.category}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <TrendingUp size={16} />
          <span>Quick Actions</span>
        </div>
        
        <div style={styles.quickActions}>
          <button style={styles.quickActionButton}>
            <Calendar size={16} />
            <span>Scheduled Posts</span>
          </button>
          
          <button style={styles.quickActionButton}>
            <Tag size={16} />
            <span>Manage Tags</span>
          </button>
          
          <button style={styles.quickActionButton}>
            <Folder size={16} />
            <span>Categories</span>
          </button>
          
          <button style={styles.quickActionButton}>
            <Clock size={16} />
            <span>Drafts</span>
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      <div style={styles.section}>
        <button onClick={clearFilters} style={styles.clearFiltersButton}>
          Clear All Filters
        </button>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || filters.dateRange !== 'all' || filters.sortBy !== 'newest' || 
        filters.category || filters.hasMedia) && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>Active Filters</span>
          </div>
          <div style={styles.activeFilters}>
            {searchQuery && (
              <span style={styles.filterTag}>
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {filters.dateRange !== 'all' && (
              <span style={styles.filterTag}>
                Date: {filters.dateRange}
              </span>
            )}
            {filters.sortBy !== 'newest' && (
              <span style={styles.filterTag}>
                Sort: {filters.sortBy}
              </span>
            )}
            {filters.category && (
              <span style={styles.filterTag}>
                Category: {filters.category}
              </span>
            )}
            {filters.hasMedia && (
              <span style={styles.filterTag}>
                Has Media
              </span>
            )}
          </div>
        </div>
      )}
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
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  createButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  clearButton: {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '2px 6px',
  },
  filterGroup: {
    marginBottom: '12px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white',
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
  },
  toggleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  advancedFilters: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
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
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  clearFiltersButton: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeFilters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  filterTag: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default Left;