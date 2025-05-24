// src/components/blog/MediaPreviews.tsx
"use client";

import React, { useState, CSSProperties } from 'react';
import { Play,  Download, File, Volume2, X, ExternalLink } from 'lucide-react';
import { VideoPostGlobal, AudioPostGlobal, FilePostGlobal } from '@/types/blog-types';

// Video Preview Component
interface VideoPreviewProps {
  videos: VideoPostGlobal[];
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoPostGlobal | null>(null);

  const openVideoModal = (video: VideoPostGlobal) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'unset';
  };

  const downloadVideo = (video: VideoPostGlobal) => {
    const link = document.createElement('a');
    link.href = video.video;
    link.download = `${video.label}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (videos.length === 0) return null;

  return (
    <>
      <div style={styles.mediaGrid}>
        {videos.map((video) => (
          <div key={video.uuid} style={styles.mediaItem}>
            <div 
              style={styles.videoPreview}
              onClick={() => openVideoModal(video)}
            >
              <div style={styles.playIcon}>
                <Play size={32} fill="white" />
              </div>
              <video style={styles.videoThumbnail} muted>
                <source src={video.video} type="video/mp4" />
              </video>
            </div>
            <div style={styles.mediaInfo}>
              <span style={styles.mediaLabel}>{video.label}</span>
              <div style={styles.mediaActions}>
                <button
                  style={styles.actionButton}
                  onClick={() => openVideoModal(video)}
                  title="Play video"
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  style={styles.actionButton}
                  onClick={() => downloadVideo(video)}
                  title="Download video"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div style={styles.modal} onClick={closeVideoModal}>
          <div style={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeButton}
              onClick={closeVideoModal}
              aria-label="Close video"
            >
              <X size={24} />
            </button>
            <div style={styles.videoWrapper}>
              <video controls autoPlay style={styles.fullVideo}>
                <source src={selectedVideo.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div style={styles.videoInfo}>
              <h3 style={styles.videoTitle}>{selectedVideo.label}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Audio Preview Component
interface AudioPreviewProps {
  audios: AudioPostGlobal[];
}

export const AudioPreview: React.FC<AudioPreviewProps> = ({ audios }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  console.log(playingAudio);

  const downloadAudio = (audio: AudioPostGlobal) => {
    const link = document.createElement('a');
    link.href = audio.audio;
    link.download = `${audio.label}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (audios.length === 0) return null;

  return (
    <div style={styles.audioList}>
      {audios.map((audio) => (
        <div key={audio.uuid} style={styles.audioItem}>
          <div style={styles.audioIcon}>
            <Volume2 size={24} color="#3b82f6" />
          </div>
          <div style={styles.audioContent}>
            <div style={styles.audioHeader}>
              <span style={styles.audioLabel}>{audio.label}</span>
              <div style={styles.audioActions}>
                <button
                  style={styles.actionButton}
                  onClick={() => downloadAudio(audio)}
                  title="Download audio"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            <div style={styles.audioPlayer}>
              <audio 
                controls 
                style={styles.audioControl}
                onPlay={() => setPlayingAudio(audio.uuid)}
                onPause={() => setPlayingAudio(null)}
              >
                <source src={audio.audio} type="audio/mp3" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// File Preview Component
interface FilePreviewProps {
  files: FilePostGlobal[];
}

export const FilePreview: React.FC<FilePreviewProps> = ({ files }) => {
  const downloadFile = (file: FilePostGlobal) => {
    const link = document.createElement('a');
    link.href = file.file;
    link.download = file.label;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const openFile = (file: FilePostGlobal) => {
    window.open(file.file, '_blank');
  };

  if (files.length === 0) return null;

  return (
    <div style={styles.fileGrid}>
      {files.map((file) => (
        <div key={file.uuid} style={styles.fileItem}>
          <div style={styles.fileIcon}>
            <File size={32} color="#6b7280" />
            <span style={styles.fileExtension}>
              {getFileExtension(file.label)}
            </span>
          </div>
          <div style={styles.fileInfo}>
            <span style={styles.fileLabel}>{file.label}</span>
            <div style={styles.fileActions}>
              <button
                style={styles.actionButton}
                onClick={() => openFile(file)}
                title="Open file"
              >
                <ExternalLink size={16} />
              </button>
              <button
                style={styles.actionButton}
                onClick={() => downloadFile(file)}
                title="Download file"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    padding: '8px',
  },
  mediaItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  videoPreview: {
    position: 'relative',
    width: '100%',
    height: '140px',
    backgroundColor: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playIcon: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mediaInfo: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: '8px',
  },
  mediaActions: {
    display: 'flex',
    gap: '4px',
  },
  actionButton: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    transition: 'all 0.2s ease',
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
  videoModalContent: {
    position: 'relative',
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1001,
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
  },
  fullVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    padding: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
  },
  videoTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
  },
  audioList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  audioItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  audioIcon: {
    marginRight: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#eff6ff',
    borderRadius: '50%',
  },
  audioContent: {
    flex: 1,
  },
  audioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  audioLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
  },
  audioActions: {
    display: 'flex',
    gap: '4px',
  },
  audioPlayer: {
    width: '100%',
  },
  audioControl: {
    width: '100%',
    height: '40px',
  },
  fileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  fileItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  fileIcon: {
    position: 'relative',
    marginBottom: '12px',
  },
  fileExtension: {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  fileInfo: {
    textAlign: 'center',
    width: '100%',
  },
  fileLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
    wordBreak: 'break-word',
  },
  fileActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
};