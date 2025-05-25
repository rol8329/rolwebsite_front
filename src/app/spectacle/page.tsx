// src/app/spectacle/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { PresentationList } from '@/components/spectacle/PresentationList';

const SpectaclePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => {
    // Handle auth actions - you can integrate with your existing auth modal system
    console.log('Auth action:', action);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Navigation Menu */}
      <NavigationMenu 
        isMobile={isMobile} 
        currentPage="spectacle"
        onAuthAction={handleAuthAction}
      />

      {/* Main Content */}
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Presentations
            </h1>
            <a
              href="/spectacle/create"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              Create Presentation
            </a>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                <input
                  type="checkbox"
                  checked={showPublicOnly}
                  onChange={(e) => setShowPublicOnly(e.target.checked)}
                  style={{ accentColor: '#3b82f6' }}
                />
                Public only
              </label>
            </div>
          </div>
        </div>

        {/* Presentations List */}
        <PresentationList 
          searchQuery={searchQuery}
          showPublicOnly={showPublicOnly}
        />
      </div>
    </div>
  );
};

export default SpectaclePage;