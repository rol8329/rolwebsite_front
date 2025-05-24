// src/app/blog/create/page.tsx
"use client";

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import TextPostForm from '@/components/create/TextPostForm';

// Create a QueryClient instance
const queryClient = new QueryClient();

interface MessagesState {
  success: string;
  error: string;
}

const CreateTextPostPage: React.FC = () => {
  const [messages, setMessages] = React.useState<MessagesState>({ success: '', error: '' });

  const handleSetMessages = (success: string, error: string) => {
    setMessages({ success, error });
    // Clear success message after 3 seconds
    if (success) {
      setTimeout(() => {
        setMessages(prev => ({ ...prev, success: '' }));
      }, 3000);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Create New Text Post</h1>
        
        {/* Messages */}
        {messages.success && (
          <div style={styles.successMessage}>{messages.success}</div>
        )}
        {messages.error && (
          <div style={styles.errorMessage}>{messages.error}</div>
        )}
        
        <TextPostForm setMessages={handleSetMessages} />
        
        <div style={styles.backLink}>
          <a href="/blog" style={styles.link}>← Back to Posts</a>
        </div>
      </div>
    </QueryClientProvider>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  successMessage: {
    padding: '12px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  backLink: {
    marginTop: '32px',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  }
};

export default CreateTextPostPage;