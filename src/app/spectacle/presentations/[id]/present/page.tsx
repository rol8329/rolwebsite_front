// src/app/spectacle/presentations/[id]/present/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePresentation } from '@/hooks/useSpectacle';
import { ChevronLeft, ChevronRight, X, Settings, Clock, Users } from 'lucide-react';

const PresentationMode: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const presentationId = parseInt(params.id as string);
  const { data: presentation, isLoading, error } = usePresentation(presentationId);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimeout();
    const handleKeyPress = () => resetTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);
    
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Keyboard navigation
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!presentation?.slides) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        if (currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex(currentSlideIndex - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        setCurrentSlideIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentSlideIndex(presentation.slides.length - 1);
        break;
      case 'Escape':
        handleExit();
        break;
      case 'f':
      case 'F11':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'n':
        e.preventDefault();
        setShowNotes(!showNotes);
        break;
    }
  }, [currentSlideIndex, presentation, showNotes]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.push(`/spectacle/presentations/${presentationId}`);
  };

  const nextSlide = () => {
    if (presentation?.slides && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading presentation...</p>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Failed to load presentation</p>
        <button 
          onClick={() => router.push('/spectacle')}
          style={styles.errorButton}
        >
          Back to Presentations
        </button>
      </div>
    );
  }

  const currentSlide = presentation.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / presentation.slides.length) * 100;

  return (
    <div style={styles.presentationContainer}>
      {/* Main Slide Display */}
      <div 
        style={{
          ...styles.slideContainer,
          backgroundColor: currentSlide?.background_color || presentation.background_color || '#ffffff',
          color: currentSlide?.text_color || presentation.text_color || '#000000'
        }}
      >
        {currentSlide ? (
          <div style={styles.slideContent}>
            {currentSlide.title && (
              <h1 style={styles.slideTitle}>
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.subtitle && (
              <h2 style={styles.slideSubtitle}>
                {currentSlide.subtitle}
              </h2>
            )}
            {currentSlide.content && (
              <div style={styles.slideText}>
                {currentSlide.content.split('\n').map((line, index) => (
                  <p key={index} style={styles.slideParagraph}>
                    {line}
                  </p>
                ))}
              </div>
            )}
            
            {/* Slide Elements */}
            {currentSlide.elements && currentSlide.elements.length > 0 && (
              <div style={styles.slideElements}>
                {currentSlide.elements.map((element) => (
                  <div
                    key={element.id}
                    style={{
                      position: 'absolute',
                      left: `${element.x_position}px`,
                      top: `${element.y_position}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      color: element.color || 'inherit',
                      backgroundColor: element.background_color || 'transparent',
                      fontSize: element.font_size || 'inherit',
                      fontFamily: element.font_family || 'inherit',
                      fontWeight: element.font_weight || 'inherit',
                    }}
                  >
                    {element.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.noSlideContent}>
            <p>No slides available</p>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Top Controls */}
          <div style={styles.topControls}>
            <div style={styles.topLeft}>
              <span style={styles.presentationTitle}>{presentation.title}</span>
              <span style={styles.slideCounter}>
                {currentSlideIndex + 1} / {presentation.slides.length}
              </span>
            </div>
            
            <div style={styles.topRight}>
              <div style={styles.timer}>
                <Clock size={16} />
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <button 
                onClick={() => setShowNotes(!showNotes)}
                style={{...styles.controlButton, backgroundColor: showNotes ? '#3b82f6' : 'transparent'}}
                title="Toggle notes"
              >
                <Settings size={18} />
              </button>
              <button 
                onClick={toggleFullscreen}
                style={styles.controlButton}
                title="Toggle fullscreen"
              >
                <Users size={18} />
              </button>
              <button 
                onClick={handleExit}
                style={styles.controlButton}
                title="Exit presentation"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${progress}%`
              }}
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            style={{
              ...styles.navButton,
              ...styles.prevButton,
              opacity: currentSlideIndex === 0 ? 0.3 : 1
            }}
            title="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === presentation.slides.length - 1}
            style={{
              ...styles.navButton,
              ...styles.nextButton,
              opacity: currentSlideIndex === presentation.slides.length - 1 ? 0.3 : 1
            }}
            title="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Speaker Notes Panel */}
      {showNotes && currentSlide?.notes && (
        <div style={styles.notesPanel}>
          <div style={styles.notesHeader}>
            <h3 style={styles.notesTitle}>Speaker Notes</h3>
            <button 
              onClick={() => setShowNotes(false)}
              style={styles.closeNotesButton}
            >
              <X size={16} />
            </button>
          </div>
          <div style={styles.notesContent}>
            {currentSlide.notes}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {showControls && (
        <div style={styles.shortcutsHelp}>
          <small style={styles.shortcutsText}>
            Use ← → or Space to navigate • F for fullscreen • N for notes • Esc to exit
          </small>
        </div>
      )}
    </div>
  );
};

const styles = {
  presentationContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 9999,
    overflow: 'hidden',
  },
  slideContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    transition: 'all 0.3s ease',
  },
  slideContent: {
    maxWidth: '90%',
    maxHeight: '90%',
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  slideTitle: {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: '800',
    marginBottom: '1rem',
    lineHeight: 1.2,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  slideSubtitle: {
    fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
    fontWeight: '600',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: 1.3,
  },
  slideText: {
    fontSize: 'clamp(1rem, 2vw, 1.8rem)',
    lineHeight: 1.6,
    maxWidth: '80%',
    margin: '0 auto',
  },
  slideParagraph: {
    marginBottom: '1rem',
  },
  slideElements: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
  },
  noSlideContent: {
    fontSize: '1.5rem',
    color: '#666',
  },
  
  // Controls
  topControls: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 1000,
    transition: 'opacity 0.3s ease',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  presentationTitle: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  slideCounter: {
    color: '#d1d5db',
    fontSize: '14px',
    fontWeight: '500',
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#d1d5db',
    fontSize: '14px',
    fontWeight: '500',
  },
  controlButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    color: 'white',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
  },
  
  // Progress bar
  progressContainer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1000,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  
  // Navigation buttons
  navButton: {
    position: 'fixed' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
    color: 'white',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
  },
  prevButton: {
    left: '20px',
  },
  nextButton: {
    right: '20px',
  },
  
  // Notes panel
  notesPanel: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    width: '300px',
    maxHeight: '200px',
    backgroundColor: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  notesHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notesTitle: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
  },
  closeNotesButton: {
    background: 'transparent',
    border: 'none',
    color: '#d1d5db',
    cursor: 'pointer',
    padding: '2px',
  },
  notesContent: {
    padding: '12px 16px',
    color: '#d1d5db',
    fontSize: '13px',
    lineHeight: 1.5,
    maxHeight: '140px',
    overflowY: 'auto' as const,
  },
  
  // Help text
  shortcutsHelp: {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  },
  shortcutsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '6px 12px',
    borderRadius: '16px',
    backdropFilter: 'blur(4px)',
  },
  
  // Loading and error states
  loadingContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    zIndex: 9999,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'white',
    fontSize: '16px',
  },
  errorContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    zIndex: 9999,
  },
  errorText: {
    color: '#ef4444',
    fontSize: '18px',
    margin: 0,
  },
  errorButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PresentationMode;