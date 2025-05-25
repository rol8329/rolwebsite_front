// src/components/flow/edges/CustomEdge.tsx
import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  useReactFlow,
} from 'reactflow';
import { X, Settings } from 'lucide-react';

interface CustomEdgeData {
  label?: string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  onDelete?: (edgeId: string) => void;
  onEdit?: (edgeId: string) => void;
}

export const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}) => {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    data?.onEdit?.(id);
  };

  const onDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(id);
    } else {
      setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }
  };

  const edgeStyle = {
    stroke: data?.color || style.stroke || '#b1b1b7',
    strokeWidth: data?.strokeWidth || style.strokeWidth || 2,
    ...style,
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={edgeStyle}
        className={`react-flow__edge-path ${data?.animated ? 'animated' : ''} ${selected ? 'selected' : ''}`}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Edge Label */}
          {data?.label && (
            <div
              className={`bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium shadow-sm transition-all ${
                selected ? 'border-blue-500 shadow-md' : 'border-gray-300'
              }`}
              onClick={onEdgeClick}
            >
              {data.label}
            </div>
          )}

          {/* Controls (show when selected) */}
          {selected && (
            <div className="flex items-center space-x-1 mt-1">
              <button
                className="bg-white border border-gray-300 rounded p-1 hover:bg-gray-50 transition-colors shadow-sm"
                onClick={onEdgeClick}
                title="Edit edge"
              >
                <Settings className="w-3 h-3 text-gray-600" />
              </button>
              <button
                className="bg-white border border-red-300 rounded p-1 hover:bg-red-50 transition-colors shadow-sm"
                onClick={onDeleteClick}
                title="Delete edge"
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// Export edge types for React Flow
export const customEdgeTypes = {
  custom: CustomEdge,
};