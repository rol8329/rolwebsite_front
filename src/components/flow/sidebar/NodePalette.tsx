// src/components/flow/sidebar/NodePalette.tsx
import React, { useState } from 'react';
import { Search, GripVertical } from 'lucide-react';
import { NodePaletteItem, NodeType } from '@/types/flow-types';

const nodePaletteItems: NodePaletteItem[] = [
  {
    type: 'customInput',
    label: 'Input Node',
    description: 'Data input or trigger point',
    icon: '📥',
    color: 'bg-blue-500',
    defaultData: {
      label: 'New Input',
      description: 'Data input node',
      color: '#3b82f6',
    },
  },
  {
    type: 'customProcess',
    label: 'Process Node',
    description: 'Data processing or transformation',
    icon: '⚙️',
    color: 'bg-green-500',
    defaultData: {
      label: 'New Process',
      description: 'Processing node',
      color: '#10b981',
    },
  },
  {
    type: 'customOutput',
    label: 'Output Node',
    description: 'Final output or result',
    icon: '📤',
    color: 'bg-red-500',
    defaultData: {
      label: 'New Output',
      description: 'Output node',
      color: '#ef4444',
    },
  },
  {
    type: 'default',
    label: 'Default Node',
    description: 'Basic node with handles',
    icon: '⭕',
    color: 'bg-gray-500',
    defaultData: {
      label: 'Default Node',
      description: 'Default node',
      color: '#6b7280',
    },
  },
];

export const NodePalette: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const filteredItems = nodePaletteItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType, defaultData: unknown) => {
    setDraggedItem(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodedata', JSON.stringify(defaultData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Node Palette</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No nodes found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.type}
                className={`group cursor-grab active:cursor-grabbing p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 ${
                  draggedItem === item.type ? 'opacity-50 scale-95' : ''
                }`}
                draggable
                onDragStart={(event) => onDragStart(event, item.type, item.defaultData)}
                onDragEnd={onDragEnd}
              >
                <div className="flex items-center space-x-3">
                  {/* Drag Handle */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Node Icon */}
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white text-lg shadow-sm`}>
                    {item.icon}
                  </div>

                  {/* Node Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.description}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity pointer-events-none" />
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <div className="text-blue-600 text-lg">💡</div>
            <div className="text-xs text-blue-700">
              <strong>How to use:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Drag nodes onto the canvas</li>
                <li>• Double-click to edit labels</li>
                <li>• Connect nodes by dragging handles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {filteredItems.length} node{filteredItems.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};