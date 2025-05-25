// src/components/flow/index.ts

// Main flow components
export { FlowProvider } from './FlowProvider';
export { FlowEditor } from './FlowEditor';
export { FlowCanvas } from './FlowCanvas';

// Node components
export { 
  CustomInputNode, 
  CustomProcessNode, 
  CustomOutputNode,
  nodeTypes 
} from './nodes';

// Toolbar components
export { FlowToolbar } from './toolbar/FlowToolbar';
export { SaveIndicator } from './toolbar/SaveIndicator';

// Sidebar components
export { NodePalette } from './sidebar/NodePalette';
export { PropertiesPanel } from './sidebar/PropertiesPanel';

// Usage example for easy import:
// import { FlowProvider, FlowEditor, NodePalette } from '@/components/flow';