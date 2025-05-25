// src/components/flow/FlowProvider.tsx
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowProviderProps {
  children: React.ReactNode;
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};