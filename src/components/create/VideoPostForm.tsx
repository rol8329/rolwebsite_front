// src/components/content/VideoPostForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useCreateBasePost, useCreateVideoPost } from '../../hooks/useSpot';
import type { CreatePostPayload, CreateMediaPayload } from '../../types/blog-types';
import { styles } from './styles';

interface VideoPostFormProps {
  setMessages: (success: string, error: string) => void;
  postUuid?: string; // Optional for new post creation

}

const VideoPostForm: React.FC<VideoPostFormProps> = ({ setMessages, postUuid }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createBasePost = useCreateBasePost();
  const createVideoPost = useCreateVideoPost();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages('', '');
    
    try {
        let targetPostUuid = postUuid;
        
        if (!targetPostUuid) {
          // If no postUuid is provided, create a new post
          const postData: CreatePostPayload = {
            title,
            content,
            actif: true
          };
          
          const basePost = await createBasePost.mutateAsync(postData);
          targetPostUuid = basePost.uuid;
        }
      
      // Then create the video post
      if (!file) {
        throw new Error('Please select a video file');
      }
      
      const mediaData: CreateMediaPayload = {
        label: label || title,
        file
      };
      
      await createVideoPost.mutateAsync({
        postUuid: targetPostUuid,
        data: mediaData
      });
      
      setMessages('Video post created successfully!', '');
      resetForm();
      
    } catch (error) {
      console.error('Error creating video post:', error);
      setMessages('', error instanceof Error ? error.message : 'An error occurred while creating your post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setLabel('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Base post fields */}
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Post Title</label>
        <input
          type="text"
          id="title"
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="content" style={styles.label}>Post Content</label>
        <textarea
          id="content"
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      {/* Video fields */}
      <div style={styles.formGroup}>
        <label htmlFor="label" style={styles.label}>Video Label</label>
        <input
          type="text"
          id="label"
          style={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="A descriptive label for the video"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="video" style={styles.label}>Video File</label>
        <input
          type="file"
          id="video"
          ref={fileInputRef}
          style={styles.input}
          accept="video/*"
          onChange={handleFileChange}
          required
        />
      </div>
      
      <button
        type="submit"
        style={isSubmitting ? styles.disabledButton : styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Video Post'}
      </button>
    </form>
  );
};

export default VideoPostForm;