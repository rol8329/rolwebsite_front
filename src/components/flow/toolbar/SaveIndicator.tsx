// src/components/flow/toolbar/SaveIndicator.tsx
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { SaveIndicatorProps } from '@/types/flow-types';

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  isSaving,
  hasUnsavedChanges,
  lastSaved,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center space-x-3 text-sm">
      {/* Saving Status */}
      {isSaving && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="w-4 h-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
          <span className="font-medium">Saving...</span>
        </div>
      )}
      
      {/* Unsaved Changes */}
      {!isSaving && hasUnsavedChanges && (
        <div className="flex items-center space-x-2 text-amber-600">
          <AlertCircle size={16} />
          <span className="font-medium">Unsaved changes</span>
        </div>
      )}
      
      {/* Saved Status */}
      {!isSaving && !hasUnsavedChanges && lastSaved && (
        <div className="flex items-center space-x-2 text-green-600">
          <Check size={16} />
          <span className="font-medium">Saved</span>
        </div>
      )}
      
      {/* Last Saved Time */}
      {lastSaved && (
        <div className="text-gray-500 border-l border-gray-300 pl-3">
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span title={`Last saved at ${formatTime(lastSaved)}`}>
              {getRelativeTime(lastSaved)}
            </span>
          </div>
        </div>
      )}

      {/* No Save History */}
      {!lastSaved && !isSaving && (
        <div className="text-gray-400 text-sm">
          Never saved
        </div>
      )}
    </div>
  );
};