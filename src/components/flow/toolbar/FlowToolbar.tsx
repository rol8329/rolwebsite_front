// src/components/flow/toolbar/FlowToolbar.tsx
import React from 'react';
import { Save, Undo, Redo, Download, Upload, Share, Settings } from 'lucide-react';
import { FlowToolbarProps } from '@/types/flow-types';
import { SaveIndicator } from './SaveIndicator';

export const FlowToolbar: React.FC<FlowToolbarProps> = ({
  onSave,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isSaving
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-md text-sm transition-colors ${
              canUndo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-md text-sm transition-colors ${
              canRedo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Additional Actions */}
        <div className="flex items-center space-x-1">
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            title="Export Flow"
          >
            <Download size={16} />
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            title="Import Flow"
          >
            <Upload size={16} />
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            title="Share Flow"
          >
            <Share size={16} />
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            title="Flow Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Save Status */}
      <SaveIndicator
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
      />
    </div>
  );
};