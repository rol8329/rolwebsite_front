// src/app/flow/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FlowProvider } from '@/components/flow/FlowProvider';
import { FlowEditor } from '@/components/flow/FlowEditor';
import { flowApi } from '@/services/api/flowApi';
import { FlowChart } from '@/types/flow-types';

export default function EditFlowPage() {
  const params = useParams();
  const router = useRouter();
  const flowId = params.id as string;
  
  const [flowChart, setFlowChart] = useState<FlowChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (flowId) {
      loadFlowChart();
    }
  }, [flowId]);

  const loadFlowChart = async () => {
    try {
      setIsLoading(true);
      const flowChart = await flowApi.getFlowChart(flowId);
      setFlowChart(flowChart);
    } catch (error) {
      setError('Failed to load flow chart');
      console.error('Failed to load flow chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading flow chart...</div>
      </div>
    );
  }

  if (error || !flowChart) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            {error || 'Flow chart not found'}
          </div>
          <button
            onClick={() => router.push('/flow')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Flow Charts
          </button>
        </div>
      </div>
    );
  }

  return (
    <FlowProvider>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/flow')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {flowChart.name}
                </h1>
                {flowChart.description && (
                  <p className="text-sm text-gray-500">{flowChart.description}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              v{flowChart.version} • Last updated: {new Date(flowChart.updated_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Flow Editor */}
        <div className="flex-1">
          <FlowEditor flowChartId={flowId} />
        </div>
      </div>
    </FlowProvider>
  );
}