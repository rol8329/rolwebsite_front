// src/components/spectacle/SlideEditor.tsx
import React, { useState } from 'react';
import { Slide, UpdateSlidePayload } from '../../types/spectacle-types';
import { useUpdateSlide, useDeleteSlide, useDuplicateSlide } from '../../hooks/useSpectacle';

interface SlideEditorProps {
  slide: Slide;
  presentationId: number;
  onSlideChange?: (slide: Slide) => void;
  onSlideDelete?: () => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  presentationId,
  onSlideChange,
  onSlideDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateSlidePayload>({
    title: slide.title || '',
    content: slide.content || '',
    subtitle: slide.subtitle || '',
    background_color: slide.background_color || '#ffffff',
    text_color: slide.text_color || '#000000',
    slide_type: slide.slide_type
  });

  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const duplicateSlide = useDuplicateSlide();

  const handleSave = () => {
    updateSlide.mutate(
      { presentationId, slideId: slide.id, data: editData },
      {
        onSuccess: (updatedSlide) => {
          setIsEditing(false);
          if (onSlideChange) {
            onSlideChange(updatedSlide);
          }
        },
        onError: (error) => {
          console.error('Error updating slide:', error);
          alert('Failed to update slide');
        }
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      deleteSlide.mutate(
        { presentationId, slideId: slide.id },
        {
          onSuccess: () => {
            if (onSlideDelete) {
              onSlideDelete();
            }
          },
          onError: (error) => {
            console.error('Error deleting slide:', error);
            alert('Failed to delete slide');
          }
        }
      );
    }
  };

  const handleDuplicate = () => {
    duplicateSlide.mutate(
      { presentationId, slideId: slide.id },
      {
        onError: (error) => {
          console.error('Error duplicating slide:', error);
          alert('Failed to duplicate slide');
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {slide.title || `Slide ${slide.order}`}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={handleDuplicate}
            disabled={duplicateSlide.isPending}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {duplicateSlide.isPending ? 'Duplicating...' : 'Duplicate'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteSlide.isPending}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deleteSlide.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={editData.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="slide_type"
                value={editData.slide_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">Title</option>
                <option value="content">Content</option>
                <option value="image">Image</option>
                <option value="code">Code</option>
                <option value="quote">Quote</option>
                <option value="two_column">Two Column</option>
                <option value="list">List</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={editData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={editData.content || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <input
                type="color"
                name="background_color"
                value={editData.background_color || '#ffffff'}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                name="text_color"
                value={editData.text_color || '#000000'}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateSlide.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateSlide.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div 
          className="min-h-32 p-4 rounded border-2 border-dashed border-gray-200"
          style={{ 
            backgroundColor: slide.background_color || '#ffffff',
            color: slide.text_color || '#000000'
          }}
        >
          {slide.title && (
            <h4 className="text-xl font-bold mb-2">{slide.title}</h4>
          )}
          {slide.subtitle && (
            <h5 className="text-lg mb-3 opacity-80">{slide.subtitle}</h5>
          )}
          {slide.content && (
            <div className="whitespace-pre-wrap">
              {slide.content}
            </div>
          )}
          {!slide.title && !slide.subtitle && !slide.content && (
            <p className="text-gray-400 italic">Empty slide - click Edit to add content</p>
          )}
        </div>
      )}
    </div>
  );
};