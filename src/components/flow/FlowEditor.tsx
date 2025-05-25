// src/components/flow/FlowEditor.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
} from 'reactflow';
import { FlowCanvas } from './FlowCanvas';
import { FlowToolbar } from './toolbar/FlowToolbar';
import { NodePalette } from './sidebar/NodePalette';
import { PropertiesPanel } from './sidebar/PropertiesPanel';
import { CustomNodeData, FlowEditorProps, FlowSnapshot } from '@/types/flow-types';
import { flowApi } from '@/services/api/flowApi';

export const FlowEditor: React.FC<FlowEditorProps> = ({
  flowChartId,
  readOnly = false,
  onSave,
  onLoad,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);

  const { getViewport, setViewport } = useReactFlow();
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Load flow data
  useEffect(() => {
    if (flowChartId) {
      loadFlowData();
    } else {
      setIsLoading(false);
    }
  }, [flowChartId]);

  const loadFlowData = async () => {
    if (!flowChartId) return;

    try {
      setIsLoading(true);
      const flowData = await flowApi.loadFlow(flowChartId);
      
      if (flowData.nodes) {
        setNodes(flowData.nodes);
      }
      if (flowData.edges) {
        setEdges(flowData.edges);
      }
      if (flowData.viewport) {
        setTimeout(() => setViewport(flowData.viewport), 100);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onLoad?.(flowData);
    } catch (error) {
      console.error('Failed to load flow:', error);
      // You could add error state handling here if needed
    } finally {
      setIsLoading(false);
    }
  };

  // Save flow data
  const saveFlow = useCallback(async (description = '') => {
    if (!flowChartId || readOnly) return;

    try {
      setIsSaving(true);
      const viewport = getViewport();

      const flowData: FlowSnapshot = {
        nodes,
        edges,
        viewport,
        changeDescription: description,
      };

      await flowApi.saveFlow(flowChartId, flowData);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onSave?.(flowData);
    } catch (error) {
      console.error('Failed to save flow:', error);
      // You could add error state handling here if needed
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, getViewport, flowChartId, readOnly, onSave]);

  // Auto-save with debouncing
  useEffect(() => {
    if (hasUnsavedChanges && flowChartId && !readOnly) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }

      autoSaveRef.current = setTimeout(() => {
        saveFlow('Auto-save');
      }, 3000); // Auto-save after 3 seconds of inactivity
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [hasUnsavedChanges, saveFlow, flowChartId, readOnly]);

  // Track changes for auto-save
  useEffect(() => {
    if (!isLoading) {
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, isLoading]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'smoothstep',
        animated: true,
        source: params.source || '',
        target: params.target || '',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes);
      setSelectedEdges(edges);
    },
    []
  );

  const onNodeAdd = useCallback((newNode: Node) => {
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
      );
    },
    [setNodes]
  );

  const onNodeDataUpdate = useCallback(
    (nodeId: string, updates: Partial<CustomNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
    },
    [setNodes]
  );

  const onEdgeUpdate = useCallback(
    (edgeId: string, updates: Partial<Edge>) => {
      setEdges((eds) =>
        eds.map((edge) => (edge.id === edgeId ? { ...edge, ...updates } : edge))
      );
    },
    [setEdges]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading flow...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      {!readOnly && (
        <FlowToolbar
          onSave={() => saveFlow('Manual save')}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSaved={lastSaved}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        {!readOnly && <NodePalette />}

        {/* Canvas */}
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onNodeAdd={onNodeAdd}
          onNodeUpdate={onNodeDataUpdate}
          readOnly={readOnly}
        />

        {/* Right Sidebar - Properties Panel */}
        {!readOnly && (
          <PropertiesPanel
            selectedNode={selectedNodes[0]}
            selectedEdge={selectedEdges[0]}
            onNodeUpdate={onNodeUpdate}
            onEdgeUpdate={onEdgeUpdate}
          />
        )}
      </div>
    </div>
  );
};

