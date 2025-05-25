// src/components/blog/PostCard.tsx
"use client";

import React, { useState, CSSProperties } from 'react';
import { BasePostGlobal } from '@/types/blog-types';
import { useUpdateBasePost } from '@/hooks/useSpot';
import type { UpdatePostPayload } from '@/types/blog-types';
import ImagePostForm from '@/components/create/ImagePostForm';
import VideoPostForm from '@/components/create/VideoPostForm';
import AudioPostForm from '@/components/create/AudioPostForm';
import FilePostForm from '@/components/create/FilePostForm';
import ImageGallery from '@/components/image/ImageGallery';
import { AudioPreview, FilePreview, VideoPreview } from '@/components/media/MediaPreviews';
import TextEditor from '@/components/text/TextEditor';

interface PostCardProps {
  post: BasePostGlobal;
}

type MediaType = 'image' | 'video' | 'audio' | 'file' | null;

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [addingMedia, setAddingMedia] = useState<MediaType>(null);
  const [messages, setMessages] = useState({ success: '', error: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  
  const updateBasePost = useUpdateBasePost();

  const handleSetMessages = (success: string, error: string) => {
    setMessages({ success, error });
    
    // Clear success message and close form after 3 seconds on success
    if (success) {
      setTimeout(() => {
        setMessages(prev => ({ ...prev, success: '' }));
        setAddingMedia(null);
      }, 3000);
    }
  };

  const handleEditPost = async () => {
    try {
      const updateData: UpdatePostPayload = {
        title: editTitle,
        content: editContent,
      };

      await updateBasePost.mutateAsync({ 
        uuid: post.uuid, 
        data: updateData 
      });

      setMessages({ success: 'Post updated successfully!', error: '' });
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessages(prev => ({ ...prev, success: '' }));
      }, 3000);

    } catch (error) {
      console.error('Error updating post:', error);
      setMessages({ 
        success: '', 
        error: error instanceof Error ? error.message : 'Failed to update post' 
      });
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
    setMessages({ success: '', error: '' });
  };

  const handleContentSave = (newContent: string) => {
    setEditContent(newContent);
  };

  const renderMediaForm = () => {
    if (!addingMedia) return null;

    const commonProps = {
      setMessages: handleSetMessages,
      postUuid: post.uuid,
    };

    switch (addingMedia) {
      case 'image':
        return <ImagePostForm {...commonProps} />;
      case 'video':
        return <VideoPostForm {...commonProps} />;
      case 'audio':
        return <AudioPostForm {...commonProps} />;
      case 'file':
        return <FilePostForm {...commonProps} />;
      default:
        return null;
    }
  };

  // Count total media items
  const totalMedia = 
    post.postImagePost.length + 
    post.postVideoPost.length + 
    post.postAudioPost.length + 
    post.postFilePost.length;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={styles.titleInput}
              placeholder="Post title..."
            />
          ) : (
            <h3 style={styles.title}>{post.title}</h3>
          )}
          
          {/* Edit Controls */}
          <div style={styles.editControls}>
            {isEditing ? (
              <>
                <button
                  onClick={handleEditPost}
                  disabled={updateBasePost.isPending}
                  style={updateBasePost.isPending ? styles.disabledButton : styles.saveButton}
                >
                  {updateBasePost.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={styles.cancelEditButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                ✏️ Edit Post
              </button>
            )}
          </div>
        </div>
        
        <div style={styles.meta}>
          <span style={styles.date}>
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          {post.updated_at !== post.created_at && (
            <span style={styles.updatedDate}>
              (Updated: {new Date(post.updated_at).toLocaleDateString()})
            </span>
          )}
          {totalMedia > 0 && (
            <span style={styles.mediaCount}>
              {totalMedia} media item{totalMedia !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {isEditing ? (
          <div style={styles.editContentContainer}>
            <div style={styles.contentPreview}>
              <strong>Current content:</strong>
              <div 
                style={styles.contentPreviewText}
                dangerouslySetInnerHTML={{ __html: editContent || '<em>No content</em>' }}
              />
            </div>
            <button
              onClick={() => setIsEditing(true)}
              style={styles.editContentButton}
            >
              ✏️ Edit Content
            </button>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </div>

      {/* Media Sections */}
      <div style={styles.mediaContainer}>
        {/* Images Section */}
        {post.postImagePost.length > 0 && (
          <div style={styles.mediaSection}>
            <div style={styles.mediaSectionHeader}>
              <h4 style={styles.mediaTitle}>
                Images ({post.postImagePost.length})
              </h4>
            </div>
            <ImageGallery images={post.postImagePost} />
          </div>
        )}

        {/* Videos Section */}
        {post.postVideoPost.length > 0 && (
          <div style={styles.mediaSection}>
            <div style={styles.mediaSectionHeader}>
              <h4 style={styles.mediaTitle}>
                Videos ({post.postVideoPost.length})
              </h4>
            </div>
            <VideoPreview videos={post.postVideoPost} />
          </div>
        )}

        {/* Audio Section */}
        {post.postAudioPost.length > 0 && (
          <div style={styles.mediaSection}>
            <div style={styles.mediaSectionHeader}>
              <h4 style={styles.mediaTitle}>
                Audio ({post.postAudioPost.length})
              </h4>
            </div>
            <AudioPreview audios={post.postAudioPost} />
          </div>
        )}

        {/* Files Section */}
        {post.postFilePost.length > 0 && (
          <div style={styles.mediaSection}>
            <div style={styles.mediaSectionHeader}>
              <h4 style={styles.mediaTitle}>
                Files ({post.postFilePost.length})
              </h4>
            </div>
            <FilePreview files={post.postFilePost} />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div style={styles.actions}>
          <h4 style={styles.actionsTitle}>Add Media</h4>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => setAddingMedia('image')}
              style={addingMedia === 'image' ? styles.activeButton : styles.button}
            >
              Add Image
            </button>
            <button 
              onClick={() => setAddingMedia('video')}
              style={addingMedia === 'video' ? styles.activeButton : styles.button}
            >
              Add Video
            </button>
            <button 
              onClick={() => setAddingMedia('audio')}
              style={addingMedia === 'audio' ? styles.activeButton : styles.button}
            >
              Add Audio
            </button>
            <button 
              onClick={() => setAddingMedia('file')}
              style={addingMedia === 'file' ? styles.activeButton : styles.button}
            >
              Add File
            </button>
            {addingMedia && (
              <button 
                onClick={() => setAddingMedia(null)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.success && (
        <div style={styles.successMessage}>{messages.success}</div>
      )}
      {messages.error && (
        <div style={styles.errorMessage}>{messages.error}</div>
      )}

      {/* Media Form */}
      {addingMedia && !isEditing && (
        <div style={styles.formContainer}>
          <h4 style={styles.formTitle}>
            Add {addingMedia.charAt(0).toUpperCase() + addingMedia.slice(1)}
          </h4>
          {renderMediaForm()}
        </div>
      )}

      {/* Text Editor Modal for Content Editing */}
      <TextEditor
        isOpen={isEditing}
        onClose={handleCancelEdit}
        initialText={editContent}
        onSave={handleContentSave}
        title="Edit Post Content"
      />
    </div>
  );
};

// Updated styles with new edit-related styles
const styles: Record<string, CSSProperties> = {
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'box-shadow 0.2s ease',
  },
  header: {
    marginBottom: '16px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '16px',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0',
    color: '#111827',
    flex: 1,
  },
  titleInput: {
    fontSize: '24px',
    fontWeight: '700',
    padding: '8px 12px',
    border: '2px solid #3b82f6',
    borderRadius: '6px',
    flex: 1,
    backgroundColor: 'white',
    color: '#111827',
  },
  editControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  cancelEditButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  disabledButton: {
    padding: '8px 16px',
    backgroundColor: '#d1d5db',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontWeight: '500',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px',
    color: '#6b7280',
    flexWrap: 'wrap',
  },
  date: {
    fontWeight: '500',
  },
  updatedDate: {
    fontStyle: 'italic',
    color: '#9ca3af',
  },
  mediaCount: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  content: {
    marginBottom: '24px',
    lineHeight: '1.7',
    color: '#374151',
    fontSize: '16px',
  },
  editContentContainer: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9fafb',
  },
  contentPreview: {
    marginBottom: '12px',
  },
  contentPreviewText: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    maxHeight: '150px',
    overflow: 'auto',
  },
  editContentButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  mediaContainer: {
    marginBottom: '24px',
  },
  mediaSection: {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  mediaSectionHeader: {
    marginBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px',
  },
  mediaTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actions: {
    marginTop: '24px',
    borderTop: '2px solid #f3f4f6',
    paddingTop: '20px',
  },
  actionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activeButton: {
    padding: '12px 20px',
    backgroundColor: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: '#ef4444',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  formContainer: {
    marginTop: '24px',
    padding: '20px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fefefe',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  },
  successMessage: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
    fontWeight: '500',
  },
  errorMessage: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    border: '1px solid #fca5a5',
    fontWeight: '500',
  },
};

export default PostCard;