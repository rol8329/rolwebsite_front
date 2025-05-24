// src/components/content/AudioPostForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useCreateBasePost, useCreateAudioPost } from '../../hooks/useSpot';
import type { CreatePostPayload, CreateMediaPayload } from '../../types/blog-types';
import { styles } from './styles';

interface AudioPostFormProps {
  setMessages: (success: string, error: string) => void;
  postUuid?: string; // Optional for new post creation

}

const AudioPostForm: React.FC<AudioPostFormProps> = ({ setMessages, postUuid }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createBasePost = useCreateBasePost();
  const createAudioPost = useCreateAudioPost();
  
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
      
      // Then create the audio post
      if (!file) {
        throw new Error('Please select an audio file');
      }
      
      const mediaData: CreateMediaPayload = {
        label: label || title,
        file
      };
      
      await createAudioPost.mutateAsync({
        postUuid: targetPostUuid,
        data: mediaData
      });
      
      setMessages('Audio post created successfully!', '');
      resetForm();
      
    } catch (error) {
      console.error('Error creating audio post:', error);
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
      
      {/* Audio fields */}
      <div style={styles.formGroup}>
        <label htmlFor="label" style={styles.label}>Audio Label</label>
        <input
          type="text"
          id="label"
          style={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="A descriptive label for the audio"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="audio" style={styles.label}>Audio File</label>
        <input
          type="file"
          id="audio"
          ref={fileInputRef}
          style={styles.input}
          accept="audio/*"
          onChange={handleFileChange}
          required
        />
      </div>
      
      <button
        type="submit"
        style={isSubmitting ? styles.disabledButton : styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Audio Post'}
      </button>
    </form>
  );
};

export default AudioPostForm;