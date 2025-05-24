// src/components/content/TextPostForm.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import { useCreateBasePost } from '../../hooks/useSpot';
import type { CreatePostPayload } from '../../types/blog-types';
import { styles } from './styles';

interface TextPostFormProps {
  setMessages: (success: string, error: string) => void;
}

const TextPostForm: React.FC<TextPostFormProps> = ({ setMessages }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createBasePost = useCreateBasePost();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages('', '');
    
    try {
      const postData: CreatePostPayload = {
        title,
        content,
        actif: true // Default to active
      };
      
      await createBasePost.mutateAsync(postData);
      setMessages('Text post created successfully!', '');
      resetForm();
      
    } catch (error) {
      console.error('Error creating text post:', error);
      setMessages('', error instanceof Error ? error.message : 'An error occurred while creating your post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setContent('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Title</label>
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
        <label htmlFor="content" style={styles.label}>Content</label>
        <textarea
          id="content"
          style={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      <button
        type="submit"
        style={isSubmitting ? styles.disabledButton : styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Text Post'}
      </button>
    </form>
  );
};
export default TextPostForm;