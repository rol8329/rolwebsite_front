// src/types/flow-types.ts
import { Node, Edge, Viewport } from 'reactflow';

export interface FlowChart {
  id: string;
  name: string;
  description?: string;
  owner: string;
  created_at: string;
  updated_at: string;
  viewport: Viewport;
  flow_settings: Record<string, unknown>;
  is_public: boolean;
  version: number;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
}

export interface FlowNode {
  id: string;
  flow_chart: string;
  node_id: string;
  node_type: NodeType;
  position_x: number;
  position_y: number;
  data: Record<string, unknown>;
  width?: number;
  height?: number;
  style: Record<string, unknown>;
  draggable: boolean;
  selectable: boolean;
  deletable: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowEdge {
  id: string;
  flow_chart: string;
  edge_id: string;
  edge_type: EdgeType;
  source_node_id: string;
  target_node_id: string;
  source_handle?: string;
  target_handle?: string;
  data: Record<string, unknown>;
  style: Record<string, unknown>;
  label?: string;
  label_style: Record<string, unknown>;
  animated: boolean;
  deletable: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlowVersion {
  id: string;
  flow_chart: string;
  version_number: number;
  snapshot_data: FlowSnapshot;
  created_at: string;
  created_by: string;
  change_description?: string;
}

export interface FlowSnapshot {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  flowSettings?: Record<string, unknown>;
  changeDescription?: string;
}

export type NodeType = 'default' | 'input' | 'output' | 'custom' | 'customInput' | 'customProcess' | 'customOutput';
export type EdgeType = 'default' | 'straight' | 'step' | 'smoothstep' | 'bezier' | 'custom';

export interface CustomNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface FlowEditorProps {
  flowChartId?: string;
  readOnly?: boolean;
  onSave?: (flowData: FlowSnapshot) => void;
  onLoad?: (flowData: FlowSnapshot) => void;
}

export interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon?: string;
  color: string;
  defaultData: CustomNodeData;
}

export interface FlowToolbarProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export interface SaveIndicatorProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
}

export interface PropertiesPanelProps {
  selectedNode?: Node;
  selectedEdge?: Edge;
  onNodeUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onEdgeUpdate: (edgeId: string, updates: Partial<Edge>) => void;
}

// API Request/Response types
export interface CreateFlowChartRequest {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface SaveFlowRequest extends FlowSnapshot {
  changeDescription?: string;
}

export interface FlowChartListResponse {
  results: FlowChart[];
  count: number;
  next?: string;
  previous?: string;
}

// Flow validation types
export interface FlowValidationResult {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FlowStatsResult {
  node_count: number;
  edge_count: number;
  last_modified: string;
  version_count: number;
  views?: number;
}