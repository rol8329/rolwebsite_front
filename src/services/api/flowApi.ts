// src/services/api/flowApi.ts
import { axiosAuthInstance, axiosPublicInstance } from './client';
import { API_URL } from '../../config/constants';
import type {
  FlowChart,
  FlowSnapshot,
  CreateFlowChartRequest,
  SaveFlowRequest,
  FlowVersion
} from '@/types/flow-types';

// Base URL for flow API endpoints
const BASE_URL = `${API_URL}/api/flowcharts`;

export const flowApi = {
  /**
   * Get all flow charts for the current user
   */
  async getFlowCharts(page = 1, pageSize = 20): Promise<{ results: FlowChart[], count: number, next?: string, previous?: string }> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/`, {
        params: { page, page_size: pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching flow charts:', error);
      throw error;
    }
  },

  /**
   * Get a specific flow chart by ID
   */
  async getFlowChart(id: string): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flow chart:', error);
      throw error;
    }
  },

  /**
   * Create a new flow chart
   */
  async createFlowChart(data: CreateFlowChartRequest): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating flow chart:', error);
      throw error;
    }
  },

  /**
   * Update flow chart metadata
   */
  async updateFlowChart(id: string, data: Partial<CreateFlowChartRequest>): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.patch(`${BASE_URL}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating flow chart:', error);
      throw error;
    }
  },

  /**
   * Delete a flow chart
   */
  async deleteFlowChart(id: string): Promise<void> {
    try {
      await axiosAuthInstance.delete(`${BASE_URL}/${id}/`);
    } catch (error) {
      console.error('Error deleting flow chart:', error);
      throw error;
    }
  },

  /**
   * Save flow data (nodes, edges, viewport)
   */
  async saveFlow(id: string, flowData: SaveFlowRequest): Promise<{ message: string, version: number }> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/${id}/save_flow/`, flowData);
      return response.data;
    } catch (error) {
      console.error('Error saving flow:', error);
      throw error;
    }
  },

  /**
   * Load flow data in React Flow format
   */
  async loadFlow(id: string): Promise<FlowSnapshot> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/export_flow/`);
      return response.data;
    } catch (error) {
      console.error('Error loading flow data:', error);
      throw error;
    }
  },

  /**
   * Get flow version history
   */
  async getFlowVersions(id: string): Promise<FlowVersion[]> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/versions/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flow versions:', error);
      throw error;
    }
  },

  /**
   * Restore a specific version
   */
  async restoreVersion(id: string, versionNumber: number): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/${id}/restore_version/`, {
        version_number: versionNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  },

  /**
   * Export flow as JSON
   */
  async exportFlowAsJson(id: string): Promise<FlowSnapshot> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/export/`, {
        params: { format: 'json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting flow:', error);
      throw error;
    }
  },

  /**
   * Import flow from JSON
   */
  async importFlowFromJson(data: FlowSnapshot & { name: string; description?: string }): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/import/`, data);
      return response.data;
    } catch (error) {
      console.error('Error importing flow:', error);
      throw error;
    }
  },

  /**
   * Get public flow chart (if sharing is enabled)
   */
  async getPublicFlowChart(id: string): Promise<FlowChart> {
    try {
      const response = await axiosPublicInstance.get(`${BASE_URL}/public/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public flow chart:', error);
      throw error;
    }
  },

  /**
   * Load public flow data (for sharing/embedding)
   */
  async loadPublicFlow(id: string): Promise<FlowSnapshot> {
    try {
      const response = await axiosPublicInstance.get(`${BASE_URL}/public/${id}/export_flow/`);
      return response.data;
    } catch (error) {
      console.error('Error loading public flow data:', error);
      throw error;
    }
  },

  /**
   * Duplicate an existing flow chart
   */
  async duplicateFlowChart(id: string, newName?: string): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/${id}/duplicate/`, {
        name: newName || `Copy of Flow Chart`
      });
      return response.data;
    } catch (error) {
      console.error('Error duplicating flow chart:', error);
      throw error;
    }
  },

  /**
   * Share flow chart (make public/private)
   */
  async updateFlowSharing(id: string, isPublic: boolean): Promise<FlowChart> {
    try {
      const response = await axiosAuthInstance.patch(`${BASE_URL}/${id}/sharing/`, {
        is_public: isPublic
      });
      return response.data;
    } catch (error) {
      console.error('Error updating flow sharing:', error);
      throw error;
    }
  },

  /**
   * Get flow chart analytics/stats
   */
  async getFlowStats(id: string): Promise<{
    node_count: number;
    edge_count: number;
    last_modified: string;
    version_count: number;
    views?: number;
  }> {
    try {
      const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/stats/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flow stats:', error);
      throw error;
    }
  },

  /**
   * Validate flow structure
   */
  async validateFlow(id: string): Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await axiosAuthInstance.post(`${BASE_URL}/${id}/validate/`);
      return response.data;
    } catch (error) {
      console.error('Error validating flow:', error);
      throw error;
    }
  }
};