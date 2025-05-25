// src/components/spectacle/PresentationCard.tsx
import React from 'react';
import Link from 'next/link';
import { PresentationBase } from '../../types/spectacle-types';

interface PresentationCardProps {
  presentation: PresentationBase;
  onDelete?: (id: number) => void;
  onClone?: (id: number) => void;
  showActions?: boolean;
  isDeleting?: boolean;
  isCloning?: boolean;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  presentation,
  onDelete,
  onClone,
  showActions = true,
  isDeleting = false,
  isCloning = false
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && window.confirm('Are you sure you want to delete this presentation?')) {
      onDelete(presentation.id);
    }
  };

  const handleClone = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClone) {
      onClone(presentation.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {presentation.thumbnail ? (
          <img
            src={presentation.thumbnail}
            alt={presentation.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-lg font-semibold">
            {presentation.title.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            presentation.is_public 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {presentation.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {presentation.title}
        </h3>
        
        {presentation.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {presentation.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>By {presentation.author.username}</span>
          <span>{presentation.slide_count} slides</span>
        </div>

        {/* Tags */}
        {presentation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {presentation.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {presentation.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{presentation.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link
              href={`/spectacle/presentations/${presentation.id}`}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              View
            </Link>
            <Link
              href={`/spectacle/presentations/${presentation.id}/edit`}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>
          </div>

          {showActions && (
            <div className="flex gap-1">
              <button
                onClick={handleClone}
                disabled={isCloning}
                className={`p-1 transition-colors ${
                  isCloning 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-blue-600'
                }`}
                title="Clone"
              >
                {isCloning ? (
                  <div className="w-4 h-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-1 transition-colors ${
                  isDeleting 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
                title="Delete"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};