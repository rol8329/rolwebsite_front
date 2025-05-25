// src/components/flow/nodes/CustomInputNode.tsx
import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Play, Settings, Copy, Trash2 } from 'lucide-react';
import { CustomNodeData } from '@/types/flow-types';

interface InputNodeProps extends NodeProps {
  data: CustomNodeData;
}

export const CustomInputNode = memo<InputNodeProps>(({ 
  id, 
  data, 
  isConnectable, 
  selected 
}) => {
  const [showControls, setShowControls] = useState(false);

  const nodeColor = data.color || '#3b82f6';
  const nodeIcon = data.icon || '📥';

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 min-w-[180px] group ${
        selected 
          ? 'border-blue-500 shadow-blue-200 shadow-lg' 
          : 'border-blue-300 hover:border-blue-400 hover:shadow-md'
      }`}
      style={{ borderColor: selected ? nodeColor : undefined }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Node Resizer */}
      {selected && (
        <NodeResizer 
          color={nodeColor}
          isVisible={selected}
          minWidth={150}
          minHeight={80}
        />
      )}

      {/* Header */}
      <div 
        className="flex items-center p-3 rounded-t-lg text-white"
        style={{ backgroundColor: nodeColor }}
      >
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-6 h-6 flex items-center justify-center bg-white bg-opacity-20 rounded">
            <span className="text-sm">{nodeIcon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {data.label || 'Input Node'}
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="w-2 h-2 bg-white bg-opacity-60 rounded-full" />
      </div>

      {/* Body */}
      <div className="p-3">
        {data.description && (
          <div className="text-xs text-gray-600 mb-2 line-clamp-2">
            {data.description}
          </div>
        )}
        
        {/* Custom Content */}
        {data.content && (
          <div className="text-sm text-gray-800">
            {data.content}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span className="flex items-center">
            <Play className="w-3 h-3 mr-1" />
            Input
          </span>
          {data.timestamp && (
            <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {/* Controls */}
      {(showControls || selected) && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 bg-white bg-opacity-90 rounded shadow-sm hover:bg-opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Handle settings
            }}
            title="Node settings"
          >
            <Settings className="w-3 h-3 text-gray-600" />
          </button>
          <button
            className="p-1 bg-white bg-opacity-90 rounded shadow-sm hover:bg-opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Handle duplicate
            }}
            title="Duplicate node"
          >
            <Copy className="w-3 h-3 text-gray-600" />
          </button>
          <button
            className="p-1 bg-white bg-opacity-90 rounded shadow-sm hover:bg-opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
            title="Delete node"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 border-2 border-white"
        style={{ 
          backgroundColor: nodeColor,
          right: -6
        }}
      />

      {/* Additional Handles if needed */}
      {data.multipleOutputs && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="output-2"
            isConnectable={isConnectable}
            className="w-3 h-3 border-2 border-white"
            style={{ 
              backgroundColor: nodeColor,
              right: -6,
              top: '70%'
            }}
          />
        </>
      )}
    </div>
  );
});

CustomInputNode.displayName = 'CustomInputNode';