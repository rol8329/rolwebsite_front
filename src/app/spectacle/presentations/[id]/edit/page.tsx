// src/app/spectacle/presentations/[id]/edit/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { SlideEditor } from '@/components/spectacle/SlideEditor';
import { 
  usePresentationWithSlides, 
  useCreateSlide, 
  useDeleteSlide,
} from '@/hooks/useSpectacle';
import { Slide } from '@/types/spectacle-types';

const EditPresentationPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const presentationId = parseInt(params.id as string);
  const initialSlideId = searchParams.get('slide');

  const { 
    presentation, 
    slides, 
    isLoading, 
    isError, 
    error 
  } = usePresentationWithSlides(presentationId);

  const createSlide = useCreateSlide();
  const deleteSlide = useDeleteSlide();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (slides && slides.length > 0) {
      if (initialSlideId) {
        const slide = slides.find(s => s.id === parseInt(initialSlideId));
        setSelectedSlide(slide || slides[0]);
      } else if (!selectedSlide) {
        setSelectedSlide(slides[0]);
      }
    }
  }, [slides, initialSlideId, selectedSlide]);

  const handleAddSlide = async () => {
    if (!presentation || !slides) return;

    try {
      const newSlideData = {
        slide_type: 'content' as const,
        order: slides.length + 1,
        title: `Slide ${slides.length + 1}`,
        content: '',
      };

      createSlide.mutate({
        presentationId,
        data: newSlideData
      }, {
        onSuccess: (newSlide) => {
          setSelectedSlide(newSlide);
        },
        onError: () => {
          alert('Failed to add slide');
        }
      });
    } catch (error) {
      alert(`Failed to add slide ${error}`);
    }
  };

  const handleDeleteSlide = async (slideId: number) => {
    if (!slides || slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }

    if (window.confirm('Are you sure you want to delete this slide?')) {
      deleteSlide.mutate({
        presentationId,
        slideId
      }, {
        onSuccess: () => {
          // Select first slide if current was deleted
          if (selectedSlide?.id === slideId && slides.length > 1) {
            const remainingSlides = slides.filter(s => s.id !== slideId);
            setSelectedSlide(remainingSlides[0]);
          }
        },
        onError: () => {
          alert('Failed to delete slide');
        }
      });
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
          <p style={{ color: '#6b7280' }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  if (isError || !presentation) {
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
      {/* Navigation */}
      <NavigationMenu 
        isMobile={isMobile} 
        currentPage="spectacle"
        onAuthAction={handleAuthAction}
      />

      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '12px 24px',
        position: 'sticky',
        top: '64px',
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1800px', 
          margin: '0 auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
            <Link
              href={`/spectacle/presentations/${presentationId}`}
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Back
            </Link>
            <h1 style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              fontWeight: '700', 
              margin: 0, 
              color: '#1f2937',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Editing: {presentation.title}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={`/spectacle/presentations/${presentationId}/present`}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Present
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 116px)' }}>
        {/* Sidebar - Slide List */}
        <div style={{ 
          width: isMobile ? '100%' : '280px', 
          backgroundColor: 'white', 
          borderRight: '1px solid #e5e7eb', 
          display: 'flex', 
          flexDirection: 'column',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: isMobile ? 200 : 'auto',
          height: '100%'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={handleAddSlide}
              disabled={createSlide.isPending}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: createSlide.isPending ? 0.5 : 1
              }}
            >
              {createSlide.isPending ? 'Adding...' : 'Add Slide'}
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {slides?.map((slide, index) => (
              <div
                key={slide.id}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedSlide?.id === slide.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  backgroundColor: selectedSlide?.id === slide.id ? '#eff6ff' : '#fafafa',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedSlide(slide)}
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
                  color: '#6b7280',
                  border: '1px solid #e5e7eb'
                }}>
                  {index + 1}
                </div>
                <p style={{ 
                  fontSize: '12px', 
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
                  fontSize: '11px', 
                  color: '#6b7280', 
                  margin: '0 0 8px 0',
                  textTransform: 'capitalize'
                }}>
                  {slide.slide_type}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlide(slide.id);
                  }}
                  style={{
                    fontSize: '10px',
                    color: '#ef4444',
                    backgroundColor: 'transparent',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
          {selectedSlide ? (
            <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
              <SlideEditor
                slide={selectedSlide}
                presentationId={presentationId}
                onSlideChange={(updatedSlide) => setSelectedSlide(updatedSlide)}
                onSlideDelete={() => {
                  if (slides && slides.length > 1) {
                    const remainingSlides = slides.filter(s => s.id !== selectedSlide.id);
                    setSelectedSlide(remainingSlides[0]);
                  }
                }}
              />
            </div>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              <p>Select a slide to edit or add your first slide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPresentationPage;