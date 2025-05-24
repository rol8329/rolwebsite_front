// src/components/content/ContentCreator.tsx
"use client";

import React, { useState } from 'react';
import { styles } from './styles';
import TextPostForm from './TextPostForm';
import ImagePostForm from './ImagePostForm';
import VideoPostForm from './VideoPostForm';
import AudioPostForm from './AudioPostForm';
import FilePostForm from './FilePostForm';

type ContentType = 'text' | 'image' | 'video' | 'audio' | 'file';

const ContentCreator: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('text');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to be passed to child components to set success/error messages
  const setMessages = (success: string = '', error: string = '') => {
    setSuccessMessage(success);
    setErrorMessage(error);
  };

  // Render the appropriate form based on content type
  const renderForm = () => {
    switch (contentType) {
      case 'text':
        return <TextPostForm setMessages={setMessages} />;
      case 'image':
        return <ImagePostForm setMessages={setMessages} />;
      case 'video':
        return <VideoPostForm setMessages={setMessages} />;
      case 'audio':
        return <AudioPostForm setMessages={setMessages} />;
      case 'file':
        return <FilePostForm setMessages={setMessages} />;
      default:
        return <TextPostForm setMessages={setMessages} />;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create New Content</h2>
      
      {/* Success/error messages */}
      {successMessage && (
        <div style={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div style={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      
      {/* Content type selection */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Content Type</label>
        <div style={styles.buttonGroup}>
          {(['text', 'image', 'video', 'audio', 'file'] as ContentType[]).map(type => (
            <button
              key={type}
              type="button"
              style={contentType === type ? styles.activeButton : styles.inactiveButton}
              onClick={() => setContentType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Render the appropriate form */}
      {renderForm()}
    </div>
  );
};

export default ContentCreator;