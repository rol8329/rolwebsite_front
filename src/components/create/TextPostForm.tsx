// src/components/content/TextPostForm.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import { useCreateBasePost } from '../../hooks/useSpot';
import type { CreatePostPayload } from '../../types/blog-types';
import { styles } from './styles';
import TextEditor from '../text/TextEditor';

interface TextPostFormProps {
  setMessages: (success: string, error: string) => void;
}

const TextPostForm: React.FC<TextPostFormProps> = ({ setMessages }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
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

  const openEditor = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const handleContentSave = (newContent: string) => {
    setContent(newContent);
  };

  // Function to get plain text from HTML for preview
  const getPlainText = (html: string) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };
  
  return (
    <>
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
          <label style={styles.label}>Content</label>
          
          {/* Content Preview/Editor Button Area */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '120px',
            padding: '12px',
            backgroundColor: '#fafafa',
            position: 'relative'
          }}>
            {content ? (
              <div>
                {/* Rich Content Preview */}
                <div 
                  style={{
                    marginBottom: '12px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                
                {/* Plain Text Preview */}
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '8px',
                  fontStyle: 'italic'
                }}>
                  Plain text: {getPlainText(content).substring(0, 100)}
                  {getPlainText(content).length > 100 ? '...' : ''}
                </div>
                
                <button
                  type="button"
                  onClick={openEditor}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit Content
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#666',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}>
                  No content yet. Click below to create your post content with rich formatting.
                </p>
                <button
                  type="button"
                  onClick={openEditor}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Create Content
                </button>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          style={isSubmitting ? styles.disabledButton : styles.submitButton}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Creating...' : 'Create Text Post'}
        </button>
      </form>

      {/* Text Editor Modal */}
      <TextEditor
        isOpen={isEditorOpen}
        onClose={closeEditor}
        initialText={content}
        onSave={handleContentSave}
        title={content ? 'Edit Post Content' : 'Create Post Content'}
      />
    </>
  );
};

export default TextPostForm;