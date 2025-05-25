// src/app/flow/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { flowApi } from '@/services/api/flowApi';
import { FlowChart } from '@/types/flow-types';

export default function FlowPage() {
  const [flowCharts, setFlowCharts] = useState<FlowChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadFlowCharts();
  }, []);

  const loadFlowCharts = async () => {
    try {
      setIsLoading(true);
      const data = await flowApi.getFlowCharts();
      setFlowCharts(data.results);
    } catch (error) {
      console.error('Failed to load flow charts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewFlow = async () => {
    try {
      setIsCreating(true);
      const newFlow = await flowApi.createFlowChart({
        name: `Flow Chart ${new Date().toLocaleDateString()}`,
        description: 'New flow chart',
      });
      setFlowCharts((prev) => [newFlow, ...prev]);
    } catch (error) {
      console.error('Failed to create flow chart:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteFlow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flow chart?')) return;

    try {
      await flowApi.deleteFlowChart(id);
      setFlowCharts((prev) => prev.filter((chart) => chart.id !== id));
    } catch (error) {
      console.error('Failed to delete flow chart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading flow charts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flow Charts</h1>
            <p className="text-gray-600 mt-2">Create and manage your flow diagrams</p>
          </div>
          <button
            onClick={createNewFlow}
            disabled={isCreating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'New Flow Chart'}
          </button>
        </div>

        {/* Flow Charts Grid */}
        {flowCharts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No flow charts yet</div>
            <button
              onClick={createNewFlow}
              disabled={isCreating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first flow chart
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flowCharts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {chart.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      href={`/flow/edit/${chart.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteFlow(chart.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {chart.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {chart.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>v{chart.version}</span>
                  <span>
                    {new Date(chart.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  href={`/flow/edit/${chart.id}`}
                  className="mt-4 block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Open Flow Chart
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


