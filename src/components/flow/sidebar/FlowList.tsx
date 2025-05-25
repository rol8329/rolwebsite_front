// src/components/flow/sidebar/FlowList.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Copy, 
  Trash2, 
  Share,
  Eye,
  Calendar,
  GitBranch
} from 'lucide-react';
import { flowApi } from '@/services/api/flowApi';
import { FlowChart } from '@/types/flow-types';

interface FlowListProps {
  onFlowSelect?: (flowId: string) => void;
  onFlowCreate?: () => void;
  selectedFlowId?: string;
  className?: string;
}

export const FlowList: React.FC<FlowListProps> = ({
  onFlowSelect,
  onFlowCreate,
  selectedFlowId,
  className = '',
}) => {
  const [flows, setFlows] = useState<FlowChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setIsLoading(true);
      const data = await flowApi.getFlowCharts();
      setFlows(data.results);
    } catch (error) {
      console.error('Failed to load flows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flow.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFlowSelect = (flowId: string) => {
    setSelectedFlow(flowId);
    onFlowSelect?.(flowId);
  };

  const handleDuplicate = async (flow: FlowChart) => {
    try {
      await flowApi.duplicateFlowChart(flow.id, `Copy of ${flow.name}`);
      loadFlows();
      setShowActions(null);
    } catch (error) {
      console.error('Failed to duplicate flow:', error);
    }
  };

  const handleDelete = async (flowId: string) => {
    if (!confirm('Are you sure you want to delete this flow?')) return;
    
    try {
      await flowApi.deleteFlowChart(flowId);
      setFlows(flows.filter(f => f.id !== flowId));
      setShowActions(null);
    } catch (error) {
      console.error('Failed to delete flow:', error);
    }
  };

  const handleShare = async (flow: FlowChart) => {
    try {
      await flowApi.updateFlowSharing(flow.id, !flow.is_public);
      loadFlows();
      setShowActions(null);
    } catch (error) {
      console.error('Failed to update sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Flow Charts
          </h3>
          <button
            onClick={onFlowCreate}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            title="Create new flow"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search flows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Flow List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFlows.length === 0 ? (
          <div className="text-center py-8 px-4">
            <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-2">
              {searchTerm ? 'No flows found' : 'No flows yet'}
            </p>
            <p className="text-xs text-gray-400">
              {searchTerm ? 'Try adjusting your search' : 'Create your first flow to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={onFlowCreate}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Create Flow
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredFlows.map((flow) => (
              <div
                key={flow.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all mb-2 ${
                  selectedFlowId === flow.id || selectedFlow === flow.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleFlowSelect(flow.id)}
              >
                {/* Flow Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {flow.name}
                    </h4>
                    {flow.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {flow.description}
                      </p>
                    )}
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(flow.updated_at)}
                        </span>
                        <span>v{flow.version}</span>
                      </div>
                      
                      {/* Status indicators */}
                      <div className="flex items-center space-x-1">
                        {flow.is_public && (
                          <div className="w-2 h-2 bg-green-400 rounded-full" title="Public" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(showActions === flow.id ? null : flow.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showActions === flow.id && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setShowActions(null)}
                        />
                        
                        {/* Actions Menu */}
                        <div className="absolute right-0 top-6 z-20 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[160px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlowSelect(flow.id);
                              setShowActions(null);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(flow);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(flow);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {flow.is_public ? <Eye className="w-4 h-4 mr-2" /> : <Share className="w-4 h-4 mr-2" />}
                            {flow.is_public ? 'Make Private' : 'Make Public'}
                          </button>
                          
                          <div className="border-t border-gray-100 my-1" />
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(flow.id);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {filteredFlows.length} flow{filteredFlows.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>
    </div>
  );
};