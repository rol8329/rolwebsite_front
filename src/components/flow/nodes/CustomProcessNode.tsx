// src/components/flow/nodes/CustomProcessNode.tsx
import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Cog, Settings, Copy, Trash2, Play, Pause } from 'lucide-react';
import { CustomNodeData } from '@/types/flow-types';

interface ProcessNodeProps extends NodeProps {
  data: CustomNodeData;
}

export const CustomProcessNode = memo<ProcessNodeProps>(({ 
  id, 
  data, 
  isConnectable, 
  selected 
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isProcessing, setIsProcessing] = useState(data.isProcessing || false);

  const nodeColor = data.color || '#10b981';
  const nodeIcon = data.icon || '⚙️';

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 min-w-[200px] group ${
        selected 
          ? 'border-green-500 shadow-green-200 shadow-lg' 
          : 'border-green-300 hover:border-green-400 hover:shadow-md'
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
          minWidth={180}
          minHeight={100}
        />
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 border-2 border-white"
        style={{ 
          backgroundColor: nodeColor,
          left: -6
        }}
      />

      {/* Additional Input Handles */}
      {data.multipleInputs && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-2"
          isConnectable={isConnectable}
          className="w-3 h-3 border-2 border-white"
          style={{ 
            backgroundColor: nodeColor,
            left: -6,
            top: '70%'
          }}
        />
      )}

      {/* Header */}
      <div 
        className="flex items-center p-3 rounded-t-lg text-white"
        style={{ backgroundColor: nodeColor }}
      >
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-6 h-6 flex items-center justify-center bg-white bg-opacity-20 rounded">
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-sm">{nodeIcon}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {data.label || 'Process Node'}
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div 
          className={`w-2 h-2 rounded-full ${
            isProcessing ? 'bg-yellow-300 animate-pulse' : 'bg-white bg-opacity-60'
          }`} 
        />
      </div>

      {/* Body */}
      <div className="p-3">
        {data.description && (
          <div className="text-xs text-gray-600 mb-2 line-clamp-2">
            {data.description}
          </div>
        )}
        
        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
            <div className="flex items-center text-xs text-yellow-700">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              Processing...
            </div>
          </div>
        )}

        {/* Custom Content */}
        {data.content && (
          <div className="text-sm text-gray-800 mb-2">
            {data.content}
          </div>
        )}

        {/* Progress Bar */}
        {data.progress !== undefined && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(data.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${data.progress}%`,
                  backgroundColor: nodeColor
                }}
              />
            </div>
          </div>
        )}

        {/* Configuration Items */}
        {data.config && (
          <div className="space-y-1">
            {Object.entries(data.config).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{key}:</span>
                <span className="text-gray-700 font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span className="flex items-center">
            <Cog className="w-3 h-3 mr-1" />
            Process
          </span>
          {data.executionTime && (
            <span>{data.executionTime}ms</span>
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
              setIsProcessing(!isProcessing);
            }}
            title={isProcessing ? "Pause process" : "Start process"}
          >
            {isProcessing ? (
              <Pause className="w-3 h-3 text-yellow-600" />
            ) : (
              <Play className="w-3 h-3 text-green-600" />
            )}
          </button>
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

      {/* Additional Output Handles */}
      {data.multipleOutputs && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="output-success"
            isConnectable={isConnectable}
            className="w-3 h-3 border-2 border-white"
            style={{ 
              backgroundColor: '#10b981',
              right: -6,
              top: '60%'
            }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="output-error"
            isConnectable={isConnectable}
            className="w-3 h-3 border-2 border-white"
            style={{ 
              backgroundColor: '#ef4444',
              right: -6,
              top: '80%'
            }}
          />
        </>
      )}
    </div>
  );
});

CustomProcessNode.displayName = 'CustomProcessNode';