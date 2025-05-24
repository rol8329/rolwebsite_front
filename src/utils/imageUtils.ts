// src/utils/imageUtils.ts
import { MEDIA_BASE_URL, API_CONFIG } from '../config/constants';

/**
 * Converts Django media URLs to properly formatted URLs
 * @param mediaPath - The media path from Django API
 * @returns Absolute URL for the media file
 */
export const getMediaUrl = (mediaPath: string): string => {
  if (!mediaPath) return '';
  
  // If already absolute URL, return as is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // Handle different formats Django might return:
  // "/media/images/file.jpg" or "images/file.jpg" or "media/images/file.jpg"
  let cleanPath = mediaPath;
  
  // Remove leading slash if present
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }
  
  // If path doesn't start with 'media/', add it
  if (!cleanPath.startsWith('media/')) {
    cleanPath = `media/${cleanPath}`;
  }
  
  return `${MEDIA_BASE_URL}/${cleanPath}`;
};

/**
 * Get optimized media URL with size parameters (for future optimization)
 * @param mediaPath - The media path from Django API
 * @param width - Desired width (optional)
 * @param height - Desired height (optional)
 * @returns Optimized media URL
 */
export const getOptimizedMediaUrl = (
  mediaPath: string, 
  width?: number, 
  height?: number
): string => {
  const baseUrl = getMediaUrl(mediaPath);
  
  if (!width && !height) return baseUrl;
  
  // For future implementation: you could add Django image optimization here
  // For now, just return the base URL
  return baseUrl;
};

/**
 * Check if the media path is a valid image based on supported types
 * @param mediaPath - The media path to validate
 * @returns boolean indicating if path is valid image
 */
export const isValidImagePath = (mediaPath: string): boolean => {
  if (!mediaPath || typeof mediaPath !== 'string') return false;
  
  const path = mediaPath.toLowerCase();
  
  // Check against supported image types from your constants
  const supportedTypes = API_CONFIG.supportedImageTypes.map(type => 
    type.replace('image/', '.')
  );
  
  return supportedTypes.some(ext => path.includes(ext));
};

/**
 * Check if the media path is a valid video
 * @param mediaPath - The media path to validate
 * @returns boolean indicating if path is valid video
 */
export const isValidVideoPath = (mediaPath: string): boolean => {
  if (!mediaPath || typeof mediaPath !== 'string') return false;
  
  const path = mediaPath.toLowerCase();
  const supportedTypes = API_CONFIG.supportedVideoTypes.map(type => 
    type.replace('video/', '.')
  );
  
  return supportedTypes.some(ext => path.includes(ext));
};

/**
 * Check if the media path is a valid audio file
 * @param mediaPath - The media path to validate
 * @returns boolean indicating if path is valid audio
 */
export const isValidAudioPath = (mediaPath: string): boolean => {
  if (!mediaPath || typeof mediaPath !== 'string') return false;
  
  const path = mediaPath.toLowerCase();
  const supportedTypes = API_CONFIG.supportedAudioTypes.map(type => 
    type.replace('audio/', '.')
  );
  
  return supportedTypes.some(ext => path.includes(ext));
};

/**
 * Get file type from media path using your supported types
 * @param mediaPath - The media path
 * @returns File type (image, video, audio, file)
 */
export const getFileType = (mediaPath: string): 'image' | 'video' | 'audio' | 'file' => {
  if (!mediaPath) return 'file';
  
  if (isValidImagePath(mediaPath)) return 'image';
  if (isValidVideoPath(mediaPath)) return 'video';
  if (isValidAudioPath(mediaPath)) return 'audio';
  
  return 'file';
};

/**
 * Validate file size against your constants
 * @param fileSize - File size in bytes
 * @param fileType - Type of file (image, video, audio, file)
 * @returns boolean indicating if file size is valid
 */
export const isValidFileSize = (fileSize: number, fileType: 'image' | 'video' | 'audio' | 'file'): boolean => {
  if (fileType === 'image') {
    return fileSize <= API_CONFIG.maxImageSize;
  }
  
  return fileSize <= API_CONFIG.maxFileSize;
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from media path
 * @param mediaPath - The media path
 * @returns File extension (e.g., "jpg", "mp4")
 */
export const getFileExtension = (mediaPath: string): string => {
  if (!mediaPath) return '';
  
  const parts = mediaPath.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Generate a thumbnail URL (for future implementation)
 * @param mediaPath - The media path
 * @param size - Thumbnail size (small, medium, large)
 * @returns Thumbnail URL
 */
export const getThumbnailUrl = (
  mediaPath: string, 
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  // For now, just return the original URL
  console.log(size);
  // In the future, you could implement Django thumbnail generation
  return getMediaUrl(mediaPath);
};

/**
 * Check if media URL is accessible
 * @param mediaUrl - The media URL to check
 * @returns Promise resolving to boolean
 */
export const isMediaAccessible = async (mediaUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(mediaUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking media accessibility:', error);
    return false;
  }
};