// src/components/content/FilePostForm.tsx
"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useCreateFilePost } from '../../hooks/useSpot';
import type { CreateMediaPayload } from '../../types/blog-types';
import { styles } from './styles';

interface FilePostFormProps {
  setMessages: (success: string, error: string) => void;
  postUuid: string;

}

const FilePostForm: React.FC<FilePostFormProps> = ({ setMessages, postUuid }) => {
  const [label, setLabel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFilePost = useCreateFilePost();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages('', '');
    
    try {
      // Then create the File post
      if (!file) {
        throw new Error('Please select an File file');
      }
      
      const mediaData: CreateMediaPayload = {
        label: label || '',
        file
      };
      
      await createFilePost.mutateAsync({
        postUuid: postUuid,
        data: mediaData
      });
      
      setMessages('File post created successfully!', '');
      resetForm();
      
    } catch (error) {
      console.error('Error creating File post:', error);
      setMessages('', error instanceof Error ? error.message : 'An error occurred while creating your post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setLabel('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* File fields */}
      <div style={styles.formGroup}>
        <label htmlFor="label" style={styles.label}>File Label</label>
        <input
          type="text"
          id="label"
          style={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="A descriptive label for the File"
        />
      </div>
      
      <div style={styles.formGroup}>
        <label htmlFor="File" style={styles.label}>File File</label>
        <input
          type="file"
          id="File"
          ref={fileInputRef}
          style={styles.input}
          accept="File/*"
          onChange={handleFileChange}
          required
        />
      </div>
      
      <button
        type="submit"
        style={isSubmitting ? styles.disabledButton : styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create File Post'}
      </button>
    </form>
  );
};

export default FilePostForm;