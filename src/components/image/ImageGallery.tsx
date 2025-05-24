// src/components/blog/ImageGallery.tsx
"use client";

import React, { useState, CSSProperties } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImagePostGlobal } from '@/types/blog-types';

interface ImageGalleryProps {
  images: ImagePostGlobal[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  if (images.length === 0) return null;

  return (
    <>
      <div style={styles.gallery}>
        {images.map((image, index) => (
          <div
            key={image.uuid}
            style={styles.thumbnailContainer}
            onClick={() => openModal(index)}
          >
            <div style={styles.thumbnailWrapper}>
              <Image
                src={image.image}
                alt={image.label}
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                style={{
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              {images.length > 1 && (
                <div style={styles.imageCounter}>
                  {index + 1}/{images.length}
                </div>
              )}
            </div>
            <div style={styles.thumbnailLabel}>{image.label}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div 
          style={styles.modal}
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              style={styles.closeButton}
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && selectedIndex > 0 && (
              <button
                style={{...styles.navButton, ...styles.prevButton}}
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {images.length > 1 && selectedIndex < images.length - 1 && (
              <button
                style={{...styles.navButton, ...styles.nextButton}}
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Main image */}
            <div style={styles.modalImageWrapper}>
              <Image
                src={images[selectedIndex].image}
                alt={images[selectedIndex].label}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'contain',
                }}
                priority
              />
            </div>

            {/* Image info */}
            <div style={styles.modalInfo}>
              <h3 style={styles.modalTitle}>{images[selectedIndex].label}</h3>
              {images.length > 1 && (
                <span style={styles.modalCounter}>
                  {selectedIndex + 1} of {images.length}
                </span>
              )}
            </div>

            {/* Thumbnail strip for multiple images */}
            {images.length > 1 && (
              <div style={styles.thumbnailStrip}>
                {images.map((image, index) => (
                  <div
                    key={image.uuid}
                    style={{
                      ...styles.stripThumbnail,
                      ...(index === selectedIndex ? styles.activeStripThumbnail : {})
                    }}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image
                      src={image.image}
                      alt={image.label}
                      fill
                      sizes="80px"
                      style={{
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, CSSProperties> = {
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    padding: '8px',
  },
  thumbnailContainer: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  imageCounter: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  thumbnailLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px',
    textAlign: 'center',
    color: '#374151',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
    maxWidth: '1200px',
    maxHeight: '800px',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    transition: 'background-color 0.2s ease',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    transition: 'background-color 0.2s ease',
  },
  prevButton: {
    left: '20px',
  },
  nextButton: {
    right: '20px',
  },
  modalImageWrapper: {
    position: 'relative',
    flex: 1,
    margin: '60px 80px 80px 80px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  modalInfo: {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textAlign: 'center',
    zIndex: 1001,
  },
  modalTitle: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    fontWeight: '600',
  },
  modalCounter: {
    fontSize: '14px',
    opacity: 0.8,
  },
  thumbnailStrip: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '12px',
    borderRadius: '8px',
    maxWidth: 'calc(100% - 40px)',
    overflowX: 'auto',
  },
  stripThumbnail: {
    position: 'relative',
    width: '60px',
    height: '60px',
    cursor: 'pointer',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '2px solid transparent',
    transition: 'border-color 0.2s ease',
    flexShrink: 0,
  },
  activeStripThumbnail: {
    borderColor: '#3b82f6',
  },
};

export default ImageGallery;