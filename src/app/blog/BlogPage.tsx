// src/app/blog/page.tsx (Updated with NavigationMenu Component)
"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
import { X, BarChart3, Filter } from 'lucide-react';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import TextPostForm from '@/components/create/TextPostForm';
import Left from '@/components/blogspot/Left';
import Middle from '@/components/blogspot/Middle';
import Right from '@/components/blogspot/Right';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ProfileForm from '@/components/auth/ProfileForm';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';


// Enhanced Modal component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = '700px' }) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        style={{
          ...styles.modalContent,
          maxWidth
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button style={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface FilterOptions {
  dateRange?: 'all' | 'today' | 'week' | 'month';
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  category?: string;
  hasMedia?: boolean;
}

const BlogPageContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'createPost' | 'login' | 'register' | 'profile' | 'settings' | 'changePassword'>('createPost');
  const [messages, setMessages] = useState({ success: '', error: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    sortBy: 'newest',
    category: '',
    hasMedia: false,
  });
  
  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenModal = (type: typeof modalType = 'createPost') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessages({ success: '', error: '' });
  };

  const handleSetMessages = (success: string, error: string) => {
    setMessages({ success, error });
    if (success) {
      setTimeout(() => {
        setIsModalOpen(false);
        setMessages({ success: '', error: '' });
      }, 2000);
    }
  };

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilterChange = (newFilters: FilterOptions) => setFilters(newFilters);

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => {
    handleOpenModal(action);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'createPost': return 'Create New Post';
      case 'login': return 'Login to Your Account';
      case 'register': return 'Create New Account';
      case 'profile': return 'Edit Profile';
      case 'settings': return 'Account Settings';
      case 'changePassword': return 'Change Password';
      default: return 'Modal';
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'createPost':
        return <TextPostForm setMessages={handleSetMessages} />;
      case 'login':
        return (
          <LoginForm
            onSuccess={() => {
              handleSetMessages('Login successful!', '');
              setTimeout(() => handleCloseModal(), 1500);
            }}
            onError={(error:string) => {
              handleSetMessages('', error);
            }}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSuccess={() => {
              handleSetMessages('Registration successful! Welcome!', '');
              setTimeout(() => handleCloseModal(), 1500);
            }}
            onError={(error:string) => {
              handleSetMessages('', error);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileForm
            onSuccess={() => {
              handleSetMessages('Profile updated successfully!', '');
              setTimeout(() => handleCloseModal(), 1500);
            }}
            onError={(error:string) => {
              handleSetMessages('', error);
            }}
          />
        );
      case 'settings':
        return (
          <div style={styles.authFormContainer}>
            <p style={styles.authFormText}>Settings page coming soon!</p>
            <button style={styles.authFormButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        );
      case 'changePassword':
        return (
          <ChangePasswordForm
            onSuccess={() => {
              handleSetMessages('Password changed successfully!', '');
              setTimeout(() => handleCloseModal(), 1500);
            }}
            onError={(error:string) => {
              handleSetMessages('', error);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Menu */}
      <NavigationMenu 
        isMobile={isMobile} 
        currentPage="blog"
        onAuthAction={handleAuthAction}
      />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>Blog Dashboard</h1>
            <p style={styles.subtitle}>
              Manage your posts, explore content, and track performance
            </p>
          </div>
          
          {/* Mobile Controls */}
          {isMobile && (
            <div style={styles.mobileControls}>
              <button 
                style={styles.mobileButton}
                onClick={() => setShowLeftPanel(!showLeftPanel)}
              >
                <Filter size={20} />
              </button>
              <button 
                style={styles.mobileButton}
                onClick={() => setShowRightPanel(!showRightPanel)}
              >
                <BarChart3 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={isMobile ? styles.mobileContent : styles.desktopContent}>
        {/* Left Column - Tools & Filters */}
        {(!isMobile || showLeftPanel) && (
          <div style={isMobile ? styles.mobilePanel : styles.leftColumn}>
            {isMobile && (
              <div style={styles.mobilePanelHeader}>
                <h3 style={styles.mobilePanelTitle}>Tools & Filters</h3>
                <button 
                  style={styles.mobilePanelClose}
                  onClick={() => setShowLeftPanel(false)}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <Left 
              onCreatePost={() => handleOpenModal('createPost')}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Middle Column - Posts List */}
        <div style={styles.middleColumn}>
          <Middle 
            searchQuery={searchQuery}
            filters={filters}
            onCreatePost={() => handleOpenModal('createPost')}
          />
        </div>

        {/* Right Column - Statistics */}
        {(!isMobile || showRightPanel) && (
          <div style={isMobile ? styles.mobilePanel : styles.rightColumn}>
            {isMobile && (
              <div style={styles.mobilePanelHeader}>
                <h3 style={styles.mobilePanelTitle}>Statistics</h3>
                <button 
                  style={styles.mobilePanelClose}
                  onClick={() => setShowRightPanel(false)}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <Right />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={getModalTitle()}
        maxWidth={modalType === 'createPost' ? '700px' : '500px'}
      >
        {renderModalContent()}
      </Modal>

      {/* Global Messages */}
      {messages.success && (
        <div style={styles.globalSuccessMessage}>
          <p style={styles.successMessageText}>✅ {messages.success}</p>
        </div>
      )}
      {messages.error && (
        <div style={styles.globalErrorMessage}>
          <p style={styles.errorMessageText}>❌ {messages.error}</p>
        </div>
      )}

      {/* Mobile Panel Backdrop */}
      {isMobile && (showLeftPanel || showRightPanel) && (
        <div 
          style={styles.mobileBackdrop}
          onClick={() => {
            setShowLeftPanel(false);
            setShowRightPanel(false);
          }}
        />
      )}
    </div>
  );
};

// Main Blog Page Component
const BlogPage: React.FC = () => {
  return <BlogPageContent />;
};

// Comprehensive styles for responsive design
const styles: Record<string, CSSProperties> = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '64px', // Account for navigation menu height
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1800px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 4px 0',
    color: '#0f172a',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    fontWeight: '400',
  },
  
  // Mobile Controls
  mobileControls: {
    display: 'flex',
    gap: '8px',
  },
  mobileButton: {
    padding: '8px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'all 0.2s ease',
  },
  
  // Layout Containers
  desktopContent: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 320px',
    gap: '24px',
    padding: '24px',
    maxWidth: '1800px',
    margin: '0 auto',
    minHeight: 'calc(100vh - 164px)', // Account for navigation + header
  },
  mobileContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    minHeight: 'calc(100vh - 144px)', // Account for navigation + header
    position: 'relative',
  },
  
  // Column Styles
  leftColumn: {
    height: 'fit-content',
    position: 'sticky',
    top: '184px', // Navigation + header height
  },
  middleColumn: {
    minWidth: 0,
    flex: 1,
  },
  rightColumn: {
    height: 'fit-content',
    position: 'sticky',
    top: '184px', // Navigation + header height
  },
  
  // Mobile Panel Styles
  mobilePanel: {
    position: 'fixed',
    top: '64px', // Below navigation
    left: '0',
    width: '85%',
    maxWidth: '350px',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'white',
    boxShadow: '4px 0 6px rgba(0, 0, 0, 0.1)',
    zIndex: 200,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  mobilePanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  mobilePanelTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  mobilePanelClose: {
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileBackdrop: {
    position: 'fixed',
    top: '64px', // Below navigation
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 150,
  },
  
  // Modal Styles
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    padding: '20px 24px 16px 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    color: '#111827',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
    overflow: 'auto',
    flex: 1,
  },
  
  // Auth Form Styles (Enhanced)
  authFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '40px 20px',
    textAlign: 'center',
  },
  authFormText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  authFormButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // Global Message Styles
  globalSuccessMessage: {
    position: 'fixed',
    top: '90px',
    right: '24px',
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
    zIndex: 1001,
    maxWidth: '300px',
  },
  globalErrorMessage: {
    position: 'fixed',
    top: '90px',
    right: '24px',
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)',
    zIndex: 1001,
    maxWidth: '300px',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
  },
  successMessageText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#065f46',
  },
  errorMessageText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
  },
};

export default BlogPage;