// src/components/flow/nodes/CustomOutputNode.tsx
import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  Copy, 
  Trash2, 
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { CustomNodeData } from '@/types/flow-types';

interface OutputNodeProps extends NodeProps {
  data: CustomNodeData;
}

export const CustomOutputNode = memo<OutputNodeProps>(({ 
  id, 
  data, 
  isConnectable, 
  selected 
}) => {
  const [showControls, setShowControls] = useState(false);
  
  const nodeColor = data.color || '#ef4444';
  const nodeIcon = data.icon || '📤';
  const status = data.status || 'pending'; // pending, success, error, processing

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'processing':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 min-w-[200px] group ${
        selected 
          ? `border-2 shadow-lg ${getStatusColor()}` 
          : `${getStatusColor()} hover:shadow-md`
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Node Resizer */}
      {selected && (
        <NodeResizer 
          color={nodeColor}
          isVisible={selected}
          minWidth={180}
          minHeight={120}
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
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="input-data"
            isConnectable={isConnectable}
            className="w-3 h-3 border-2 border-white"
            style={{ 
              backgroundColor: '#3b82f6',
              left: -6,
              top: '60%'
            }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="input-config"
            isConnectable={isConnectable}
            className="w-3 h-3 border-2 border-white"
            style={{ 
              backgroundColor: '#8b5cf6',
              left: -6,
              top: '80%'
            }}
          />
        </>
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
              {data.label || 'Output Node'}
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {data.description && (
          <div className="text-xs text-gray-600 mb-3 line-clamp-2">
            {data.description}
          </div>
        )}

        {/* Output Preview */}
        {data.output && (
          <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Output</span>
              <button
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle view full output
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </button>
            </div>
            <div className="text-xs text-gray-800 font-mono bg-white border rounded p-1 max-h-16 overflow-y-auto">
              {typeof data.output === 'string' 
                ? data.output.slice(0, 100) + (data.output.length > 100 ? '...' : '')
                : JSON.stringify(data.output, null, 2).slice(0, 100) + '...'
              }
            </div>
          </div>
        )}

        {/* Status Details */}
        <div className="space-y-2">
          {status === 'success' && data.outputCount && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Records:</span>
              <span className="text-green-600 font-medium">{data.outputCount}</span>
            </div>
          )}

          {status === 'error' && data.error && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="text-xs text-red-700 font-medium mb-1">Error</div>
              <div className="text-xs text-red-600">{data.error}</div>
            </div>
          )}

          {data.fileSize && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Size:</span>
              <span className="text-gray-700">{data.fileSize}</span>
            </div>
          )}

          {data.format && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Format:</span>
              <span className="text-gray-700 uppercase">{data.format}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {status === 'success' && data.downloadUrl && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle download
                window.open(data.downloadUrl, '_blank');
              }}
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 text-xs text-gray-400">
          <span className="flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            Output
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

      {/* Output Handle (conditional) */}
      {data.hasOutput && (
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
      )}
    </div>
  );
});

CustomOutputNode.displayName = 'CustomOutputNode';