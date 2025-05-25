// src/components/flow/sidebar/PropertiesPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Type, 
  Palette, 
  Info, 
  Link, 
  Trash2, 
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { PropertiesPanelProps } from '@/types/flow-types';

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
}) => {
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeColor, setNodeColor] = useState('#3b82f6');
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeAnimated, setEdgeAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'style'>('properties');

  // Update local state when selection changes
  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data?.label || '');
      setNodeDescription(selectedNode.data?.description || '');
      setNodeColor(selectedNode.data?.color || '#3b82f6');
    }
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(selectedEdge.label || '');
      setEdgeAnimated(selectedEdge.animated || false);
    }
  }, [selectedEdge]);

  const handleNodeUpdate = (field: string, value: any) => {
    if (selectedNode) {
      const updates = {
        data: {
          ...selectedNode.data,
          [field]: value,
        },
      };
      onNodeUpdate(selectedNode.id, updates);
    }
  };

  const handleNodeStyleUpdate = (field: string, value: any) => {
    if (selectedNode) {
      const updates = {
        style: {
          ...selectedNode.style,
          [field]: value,
        },
      };
      onNodeUpdate(selectedNode.id, updates);
    }
  };

  const handleEdgeUpdate = (field: string, value: any) => {
    if (selectedEdge) {
      const updates = { [field]: value };
      onEdgeUpdate(selectedEdge.id, updates);
    }
  };

  const predefinedColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#ef4444', // Red
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#6b7280', // Gray
  ];

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No Selection</p>
            <p className="text-xs mt-1">Select a node or edge to edit properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Properties</h3>
        
        {/* Selection Info */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center space-x-2">
            {selectedNode ? (
              <>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-700">Node Selected</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm font-medium text-gray-700">Edge Selected</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ID: {selectedNode?.id || selectedEdge?.id}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'properties'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="w-4 h-4 inline mr-1" />
            Properties
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'style'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-1" />
            Style
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedNode && activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            {/* Node Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Type className="w-4 h-4 inline mr-1" />
                Label
              </label>
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => {
                  setNodeLabel(e.target.value);
                  handleNodeUpdate('label', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter node label"
              />
            </div>

            {/* Node Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Info className="w-4 h-4 inline mr-1" />
                Description
              </label>
              <textarea
                value={nodeDescription}
                onChange={(e) => {
                  setNodeDescription(e.target.value);
                  handleNodeUpdate('description', e.target.value);
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                placeholder="Enter node description"
              />
            </div>

            {/* Node Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <input
                type="text"
                value={selectedNode.type}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position.x)}
                    disabled
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.position.y)}
                    disabled
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedNode && activeTab === 'style' && (
          <div className="p-4 space-y-4">
            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Node Color
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setNodeColor(color);
                      handleNodeUpdate('color', color);
                    }}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      nodeColor === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={nodeColor}
                onChange={(e) => {
                  setNodeColor(e.target.value);
                  handleNodeUpdate('color', e.target.value);
                }}
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!selectedNode.hidden}
                  onChange={(e) => handleNodeStyleUpdate('display', e.target.checked ? 'block' : 'none')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedNode.hidden ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                  Visible
                </span>
              </label>
            </div>

            {/* Node Behavior */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Behavior</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNode.draggable !== false}
                    onChange={(e) => onNodeUpdate(selectedNode.id, { draggable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Draggable</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNode.selectable !== false}
                    onChange={(e) => onNodeUpdate(selectedNode.id, { selectable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Selectable</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNode.deletable !== false}
                    onChange={(e) => onNodeUpdate(selectedNode.id, { deletable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Deletable</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {selectedEdge && (
          <div className="p-4 space-y-4">
            {/* Edge Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Type className="w-4 h-4 inline mr-1" />
                Edge Label
              </label>
              <input
                type="text"
                value={edgeLabel}
                onChange={(e) => {
                  setEdgeLabel(e.target.value);
                  handleEdgeUpdate('label', e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter edge label"
              />
            </div>

            {/* Edge Animation */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={edgeAnimated}
                  onChange={(e) => {
                    setEdgeAnimated(e.target.checked);
                    handleEdgeUpdate('animated', e.target.checked);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Animated</span>
              </label>
            </div>

            {/* Connection Info */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                <Link className="w-4 h-4 inline mr-1" />
                Connection
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="font-mono">{selectedEdge.source}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-mono">{selectedEdge.target}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{selectedEdge.type}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};