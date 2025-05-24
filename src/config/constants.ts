// src/config/constants.ts

const DJANGO_BASE_URL = 'http://127.0.0.1:8000';

export const API_URL = `${DJANGO_BASE_URL}/blog-api`;
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

// Base URL for media files
export const MEDIA_BASE_URL = DJANGO_BASE_URL;

// Full media URL constructor
export const MEDIA_URL = `${MEDIA_BASE_URL}/media`;

// src/config/constants.ts
export const API_CONFIG = {
    BASE_URL: API_URL,
    TIMEOUT: 10000,
    RETRY_LIMIT: 3,
    STATUS_CODES: {
      RETRY: [408, 413, 429, 500, 502, 503, 504],
    },
    name: 'Blog App',
    version: '1.0.0',
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    supportedVideoTypes: ['video/mp4', 'video/webm'],
    supportedAudioTypes: ['audio/mp3', 'audio/wav', 'audio/ogg'],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxImageSize: 10 * 1024 * 1024, // 10MB
  } as const;

  export const QUERY_CONFIG = {
    STALE_TIME: 5 * 60 * 1000,  // 5 minutes
    GC_TIME: 30 * 60 * 1000,    // 30 minutes
    DEFAULT_OPTIONS: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  } as const;

  export const TOKEN_CONFIG = {
    REFRESH_THRESHOLD: 5 * 60 * 1000,  // 5 minutes
    EXPIRATION_TIME: 55 * 60 * 1000,    // 55 minutes
  } as const;

  export const defaultZoom = 10;

