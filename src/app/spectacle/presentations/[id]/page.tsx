// src/app/spectacle/presentations/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { usePresentation, useDeletePresentation, useExportPresentation } from '@/hooks/useSpectacle';

const PresentationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const presentationId = parseInt(params.id as string);
  
  const { data: presentation, isLoading, error } = usePresentation(presentationId);
  const deletePresentation = useDeletePresentation();
  const { data: exportData } = useExportPresentation(presentationId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this presentation?')) {
      deletePresentation.mutate(presentationId, {
        onSuccess: () => {
          router.push('/spectacle');
        },
        onError: () => {
          alert('Failed to delete presentation');
        }
      });
    }
  };

  const handleExport = async () => {
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation?.title || 'presentation'}-spectacle.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => {
    console.log('Auth action:', action);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <NavigationMenu 
          isMobile={isMobile} 
          currentPage="spectacle"
          onAuthAction={handleAuthAction}
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 64px)',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280' }}>Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <NavigationMenu 
          isMobile={isMobile} 
          currentPage="spectacle"
          onAuthAction={handleAuthAction}
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 64px)',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <p style={{ color: '#ef4444', fontSize: '18px' }}>
            {error ? 'Failed to load presentation' : 'Presentation not found'}
          </p>
          <Link
            href="/spectacle"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Back to Presentations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <NavigationMenu 
        isMobile={isMobile} 
        currentPage="spectacle"
        onAuthAction={handleAuthAction}
      />

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                margin: '0 0 8px 0',
                color: '#1f2937'
              }}>
                {presentation.title}
              </h1>
              {presentation.description && (
                <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                  {presentation.description}
                </p>
              )}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                <span>By {presentation.author.username}</span>
                <span>{presentation.slides.length} slides</span>
                <span>Created {new Date(presentation.created_at).toLocaleDateString()}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: presentation.is_public ? '#d1fae5' : '#f3f4f6',
                  color: presentation.is_public ? '#065f46' : '#374151'
                }}>
                  {presentation.is_public ? 'Public' : 'Private'}
                </span>
              </div>

              {presentation.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {presentation.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '12px',
                        borderRadius: '16px',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
              <Link
                href={`/spectacle/presentations/${presentationId}/edit`}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Edit
              </Link>
              <button
                onClick={handleExport}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Export
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePresentation.isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: deletePresentation.isPending ? 0.5 : 1
                }}
              >
                {deletePresentation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Slides Overview */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 16px 0', color: '#1f2937' }}>
            Slides ({presentation.slides.length})
          </h2>
          
          {presentation.slides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p style={{ margin: '0 0 16px 0' }}>No slides yet. Start editing to add slides.</p>
              <Link
                href={`/spectacle/presentations/${presentationId}/edit`}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                Add First Slide
              </Link>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '150px' : '200px'}, 1fr))`, 
              gap: '16px' 
            }}>
              {presentation.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fafafa'
                  }}
                  onClick={() => router.push(`/spectacle/presentations/${presentationId}/edit?slide=${slide.id}`)}
                >
                  <div style={{
                    aspectRatio: '16/9',
                    backgroundColor: slide.background_color || '#f3f4f6',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Slide {index + 1}
                  </div>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    margin: '0 0 4px 0', 
                    color: '#1f2937',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {slide.title || `Slide ${index + 1}`}
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {slide.slide_type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '24px' }}>
          <Link
            href="/spectacle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back to Presentations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PresentationDetailPage;