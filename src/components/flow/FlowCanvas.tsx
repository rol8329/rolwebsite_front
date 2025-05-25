// src/components/flow/FlowCanvas.tsx
import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import { CustomNodeData } from '@/types/flow-types';
import { nodeTypes } from '.';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: Node) => void;
  onEdgesChange: (changes: Edge) => void;
  onConnect: (connection: Connection) => void;
  onSelectionChange?: (params: { nodes: Node[]; edges: Edge[] }) => void;
  readOnly?: boolean;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  readOnly = false,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      const nodeDataStr = event.dataTransfer.getData('application/nodedata');

      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      let defaultData: CustomNodeData = {
        label: `${nodeType} node`,
        description: 'Double-click to edit',
      };

      try {
        if (nodeDataStr) {
          defaultData = JSON.parse(nodeDataStr);
        }
      } catch (e) {
        console.warn('Failed to parse node data:', e);
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: nodeType,
        position,
        data: defaultData,
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (readOnly) return;

      const newLabel = prompt('Enter new label:', node.data?.label || '');
      const newDescription = prompt('Enter description:', node.data?.description || '');

      if (newLabel !== null) {
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
            description: newDescription || node.data?.description || '',
          },
        };

        onNodesChange([{ type: 'replace', id: node.id, item: updatedNode }]);
      }
    },
    [onNodesChange, readOnly]
  );

  const handleConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      onConnect(params);
    },
    [onConnect, readOnly]
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDoubleClick={onNodeDoubleClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        className="bg-gray-50"
        deleteKeyCode={readOnly ? null : ['Backspace', 'Delete']}
      >
        <Controls showInteractive={!readOnly} />
        <MiniMap />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />      </ReactFlow>
    </div>
  );
};

