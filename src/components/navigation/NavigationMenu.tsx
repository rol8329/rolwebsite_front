// src/components/navigation/NavigationMenu.tsx
"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
import { 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Settings, 
  Lock, 
  Menu,
  Home,
  BookOpen,
  TrendingUp,
  GitBranch,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationMenuProps {
  isMobile: boolean;
  currentPage?: string;
  onAuthAction?: (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  isMobile, 
  currentPage = 'blog',
  onAuthAction 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close menus when clicking outside or when auth state changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-user-menu]') && !target.closest('[data-mobile-menu]')) {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when authentication state changes
  useEffect(() => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => {
    onAuthAction?.(action);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', key: 'dashboard' },
    { icon: BookOpen, label: 'Blog', href: '/blog', key: 'blog' },
    { icon: GitBranch, label: 'Flow Charts', href: '/flow', key: 'flow' },
    { icon: TrendingUp, label: 'Analytics', href: '/analytics', key: 'analytics' },
  ];

  const authMenuItems = isAuthenticated ? [
    { icon: User, label: 'Profile', action: () => handleAuthAction('profile') },
    { icon: Settings, label: 'Settings', action: () => handleAuthAction('settings') },
    { icon: Lock, label: 'Change Password', action: () => handleAuthAction('changePassword') },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ] : [
    { icon: LogIn, label: 'Login', action: () => handleAuthAction('login') },
    { icon: UserPlus, label: 'Register', action: () => handleAuthAction('register') },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo/Brand */}
        <div style={styles.navBrand}>
          <span style={styles.brandText}>BlogApp</span>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            {/* Main Navigation Links */}
            <div style={styles.navLinks}>
              {navigationItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  style={
                    item.key === currentPage 
                      ? { ...styles.navLink, ...styles.navLinkActive } 
                      : styles.navLink
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* User Menu */}
            <div style={styles.userMenu} data-user-menu>
              {isAuthenticated ? (
                <div style={styles.userMenuContainer}>
                  <button
                    style={styles.userMenuButton}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div style={styles.userAvatar}>
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <span style={styles.userName}>
                      {user?.first_name || user?.username || 'User'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showUserMenu && (
                    <div style={styles.userDropdown}>
                      <div style={styles.userInfo}>
                        <p style={styles.userDisplayName}>
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p style={styles.userEmail}>{user?.email}</p>
                        <p style={styles.userRole}>Role: {user?.role}</p>
                      </div>
                      <div style={styles.dropdownDivider} />
                      {authMenuItems.map((item) => (
                        <button
                          key={item.label}
                          style={styles.dropdownItem}
                          onClick={item.action}
                        >
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.authButtons}>
                  <button 
                    style={styles.loginButton} 
                    onClick={() => handleAuthAction('login')}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                  <button 
                    style={styles.registerButton} 
                    onClick={() => handleAuthAction('register')}
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <div style={styles.mobileMenuContainer} data-mobile-menu>
            {isAuthenticated && (
              <div style={styles.mobileUserInfo}>
                <div style={styles.mobileUserAvatar}>
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
              </div>
            )}
            <button
              style={styles.mobileMenuButton}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && showMobileMenu && (
        <div style={styles.mobileMenuDropdown}>
          {/* Navigation Items */}
          <div style={styles.mobileNavSection}>
            <p style={styles.mobileMenuTitle}>Navigation</p>
            {navigationItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                style={
                  item.key === currentPage 
                    ? { ...styles.mobileNavItem, ...styles.mobileNavItemActive } 
                    : styles.mobileNavItem
                }
                onClick={() => setShowMobileMenu(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div style={styles.mobileMenuDivider} />

          {/* Auth Items */}
          <div style={styles.mobileNavSection}>
            <p style={styles.mobileMenuTitle}>
              {isAuthenticated ? 'Account' : 'Authentication'}
            </p>
            {isAuthenticated && (
              <div style={styles.mobileUserInfoSection}>
                <p style={styles.mobileUserName}>
                  {user?.first_name} {user?.last_name}
                </p>
                <p style={styles.mobileUserEmail}>{user?.email}</p>
                <p style={styles.mobileUserRole}>Role: {user?.role}</p>
              </div>
            )}
            {authMenuItems.map((item) => (
              <button
                key={item.label}
                style={styles.mobileNavItem}
                onClick={() => {
                  item.action();
                  setShowMobileMenu(false);
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobile && showMobileMenu && (
        <div 
          style={styles.mobileMenuBackdrop}
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </nav>
  );
};

// Comprehensive styles for the navigation menu
const styles: Record<string, CSSProperties> = {
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: '1800px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '64px',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandText: {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  navLinkActive: {
    backgroundColor: '#f1f5f9',
    color: '#3b82f6',
  },
  userMenu: {
    position: 'relative',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userMenuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  userName: {
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    minWidth: '240px',
    zIndex: 50,
  },
  userInfo: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  userDisplayName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  userEmail: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  userRole: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
    textTransform: 'capitalize',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  dropdownItemHover: {
    backgroundColor: '#f9fafb',
  },
  authButtons: {
    display: 'flex',
    gap: '8px',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  registerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // Mobile Styles
  mobileMenuContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  mobileUserAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
  },
  mobileMenuButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuDropdown: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto',
  },
  mobileNavSection: {
    padding: '16px',
  },
  mobileMenuTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px 0',
  },
  mobileNavItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    color: '#374151',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    borderRadius: '4px',
  },
  mobileNavItemActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  mobileMenuDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '0 16px',
  },
  mobileUserInfoSection: {
    padding: '12px 0 16px 0',
    borderBottom: '1px solid #f3f4f6',
    marginBottom: '8px',
  },
  mobileUserName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  mobileUserEmail: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  mobileUserRole: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
    textTransform: 'capitalize',
  },
  mobileMenuBackdrop: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
};

export default NavigationMenu;