// src/components/content/ImagePostForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {  useCreateImagePost } from '../../hooks/useSpot';
import type {  CreateMediaPayload } from '../../types/blog-types';
import { styles } from './styles';

interface ImagePostFormProps {
  postUuid: string;
  setMessages: (success: string, error: string) => void;
}

const ImagePostForm: React.FC<ImagePostFormProps> = ({postUuid, setMessages }) => {
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createImagePost = useCreateImagePost();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages('', '');
    
    try {

      // Then create the image post
      if (!file) {
        throw new Error('Please select an image file');
      }
      
      const mediaData: CreateMediaPayload = {
        label: label || 'image', 
        file
      };
      
      await createImagePost.mutateAsync({
        postUuid: postUuid,
        data: mediaData
      });
      
      setMessages('Image post created successfully!', '');
      resetForm();
      
    } catch (error) {
      console.error('Error creating image post:', error);
      setMessages('', error instanceof Error ? error.message : 'An error occurred while creating your post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setLabel('');
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Image fields */}
      <div style={styles.formGroup}>
        <label htmlFor="label" style={styles.label}>Image Label</label>
        <input
          type="text"
          id="label"
          style={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="A descriptive label for the image"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="image" style={styles.label}>Image File</label>
        <input
          type="file"
          id="image"
          ref={fileInputRef}
          style={styles.input}
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>
      
      {/* Image preview */}
      {preview && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Preview</label>
          <img src={preview} alt="Preview" style={styles.previewImage} />
        </div>
      )}
      
      <button
        type="submit"
        style={isSubmitting ? styles.disabledButton : styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Image Post'}
      </button>
    </form>
  );
};

export default ImagePostForm;