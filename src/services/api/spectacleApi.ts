// src/services/api/spectacleApi.ts
import { axiosAuthInstance, axiosPublicInstance } from './client';
import { API_URL } from '../../config/constants';
import type {
  PresentationBase,
  PresentationDetail,
  PresentationTemplate,
  Slide,
  SlideElement,
  CreatePresentationPayload,
  UpdatePresentationPayload,
  CreateSlidePayload,
  UpdateSlidePayload,
  CreateSlideElementPayload,
  UpdateSlideElementPayload,
  ClonePresentationPayload,
  BulkSlideUpdatePayload,
  SpectacleExport,
  PresentationFilters
} from '../../types/spectacle-types';

// Base URL for presentations API
const BASE_URL = `${API_URL}/api/presentations`;

export const spectacleApi = {
  // ===========================
  // PRESENTATION ENDPOINTS
  // ===========================

  /**
   * Fetch all presentations with optional filtering
   */
  async getPresentations(filters?: PresentationFilters): Promise<PresentationBase[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.author) params.append('author', filters.author.toString());
      if (filters?.tag) params.append('tag', filters.tag);
      if (filters?.is_public !== undefined) params.append('is_public', filters.is_public.toString());

      const queryString = params.toString();
      const url = queryString ? `${BASE_URL}/?${queryString}` : `${BASE_URL}/`;
      
      const response = await axiosPublicInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching presentations:', error);
      return [];
    }
  },

  /**
   * Create a new presentation
   */
  async createPresentation(data: CreatePresentationPayload): Promise<PresentationDetail> {
    const formData = new FormData();
    
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.is_public !== undefined) formData.append('is_public', data.is_public.toString());
    if (data.theme) formData.append('theme', data.theme);
    if (data.template) formData.append('template', data.template);
    if (data.transition) formData.append('transition', data.transition);
    if (data.background_color) formData.append('background_color', data.background_color);
    if (data.text_color) formData.append('text_color', data.text_color);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

    const response = await axiosAuthInstance.post(`${BASE_URL}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Get a specific presentation with all slides and elements
   */
  async getPresentation(id: number): Promise<PresentationDetail> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Update a presentation
   */
  async updatePresentation(id: number, data: UpdatePresentationPayload): Promise<PresentationDetail> {
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.is_public !== undefined) formData.append('is_public', data.is_public.toString());
    if (data.theme) formData.append('theme', data.theme);
    if (data.template) formData.append('template', data.template);
    if (data.transition) formData.append('transition', data.transition);
    if (data.background_color) formData.append('background_color', data.background_color);
    if (data.text_color) formData.append('text_color', data.text_color);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

    const response = await axiosAuthInstance.put(`${BASE_URL}/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Delete a presentation
   */
  async deletePresentation(id: number): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/${id}/`);
  },

  /**
   * Clone an existing presentation
   */
  async clonePresentation(id: number, data: ClonePresentationPayload): Promise<PresentationDetail> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/${id}/clone/`, data);
    return response.data;
  },

  /**
   * Export presentation in Spectacle format
   */
  async exportPresentation(id: number): Promise<SpectacleExport> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/${id}/export/`);
    return response.data;
  },

  // ===========================
  // SLIDE ENDPOINTS
  // ===========================

  /**
   * Get all slides for a presentation
   */
  async getSlides(presentationId: number): Promise<Slide[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${presentationId}/slides/`);
    return response.data;
  },

  /**
   * Create a new slide
   */
  async createSlide(presentationId: number, data: CreateSlidePayload): Promise<Slide> {
    const formData = new FormData();
    
    if (data.slide_type) formData.append('slide_type', data.slide_type);
    formData.append('order', data.order.toString());
    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.background_color) formData.append('background_color', data.background_color);
    if (data.background_image) formData.append('background_image', data.background_image);
    if (data.text_color) formData.append('text_color', data.text_color);
    if (data.font_size) formData.append('font_size', data.font_size);
    if (data.text_align) formData.append('text_align', data.text_align);
    if (data.transition) formData.append('transition', data.transition);
    if (data.animation) formData.append('animation', data.animation);
    if (data.custom_css) formData.append('custom_css', data.custom_css);
    if (data.layout_config) formData.append('layout_config', JSON.stringify(data.layout_config));
    if (data.notes) formData.append('notes', data.notes);

    const response = await axiosAuthInstance.post(`${BASE_URL}/${presentationId}/slides/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Get a specific slide
   */
  async getSlide(presentationId: number, slideId: number): Promise<Slide> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${presentationId}/slides/${slideId}/`);
    return response.data;
  },

  /**
   * Update a slide
   */
  async updateSlide(presentationId: number, slideId: number, data: UpdateSlidePayload): Promise<Slide> {
    const formData = new FormData();
    
    if (data.slide_type) formData.append('slide_type', data.slide_type);
    if (data.order !== undefined) formData.append('order', data.order.toString());
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.subtitle !== undefined) formData.append('subtitle', data.subtitle);
    if (data.background_color) formData.append('background_color', data.background_color);
    if (data.background_image) formData.append('background_image', data.background_image);
    if (data.text_color) formData.append('text_color', data.text_color);
    if (data.font_size) formData.append('font_size', data.font_size);
    if (data.text_align) formData.append('text_align', data.text_align);
    if (data.transition) formData.append('transition', data.transition);
    if (data.animation) formData.append('animation', data.animation);
    if (data.custom_css !== undefined) formData.append('custom_css', data.custom_css);
    if (data.layout_config) formData.append('layout_config', JSON.stringify(data.layout_config));
    if (data.notes !== undefined) formData.append('notes', data.notes);

    const response = await axiosAuthInstance.put(`${BASE_URL}/${presentationId}/slides/${slideId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Delete a slide
   */
  async deleteSlide(presentationId: number, slideId: number): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/${presentationId}/slides/${slideId}/`);
  },

  /**
   * Bulk update slide orders
   */
  async bulkUpdateSlides(presentationId: number, data: BulkSlideUpdatePayload): Promise<Slide[]> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/${presentationId}/slides/bulk-update/`, data);
    return response.data;
  },

  // ===========================
  // SLIDE ELEMENT ENDPOINTS
  // ===========================

  /**
   * Get all elements for a slide
   */
  async getSlideElements(presentationId: number, slideId: number): Promise<SlideElement[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${presentationId}/slides/${slideId}/elements/`);
    return response.data;
  },

  /**
   * Create a new slide element
   */
  async createSlideElement(presentationId: number, slideId: number, data: CreateSlideElementPayload): Promise<SlideElement> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/${presentationId}/slides/${slideId}/elements/`, data);
    return response.data;
  },

  /**
   * Get a specific slide element
   */
  async getSlideElement(presentationId: number, slideId: number, elementId: number): Promise<SlideElement> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${presentationId}/slides/${slideId}/elements/${elementId}/`);
    return response.data;
  },

  /**
   * Update a slide element
   */
  async updateSlideElement(
    presentationId: number, 
    slideId: number, 
    elementId: number, 
    data: UpdateSlideElementPayload
  ): Promise<SlideElement> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/${presentationId}/slides/${slideId}/elements/${elementId}/`, data);
    return response.data;
  },

  /**
   * Delete a slide element
   */
  async deleteSlideElement(presentationId: number, slideId: number, elementId: number): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/${presentationId}/slides/${slideId}/elements/${elementId}/`);
  },

  // ===========================
  // TEMPLATE ENDPOINTS
  // ===========================

  /**
   * Get all presentation templates
   */
  async getTemplates(): Promise<PresentationTemplate[]> {
    try {
      const response = await axiosPublicInstance.get(`${API_URL}/api/templates/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  },

  /**
   * Create a new template
   */
  async createTemplate(data: Partial<PresentationTemplate>): Promise<PresentationTemplate> {
    const response = await axiosAuthInstance.post(`${API_URL}/api/templates/`, data);
    return response.data;
  },

  // ===========================
  // UTILITY METHODS
  // ===========================

  /**
   * Get presentations by current user
   */
  async getMyPresentations(): Promise<PresentationBase[]> {
    return this.getPresentations();
  },

  /**
   * Get public presentations only
   */
  async getPublicPresentations(): Promise<PresentationBase[]> {
    return this.getPresentations({ is_public: true });
  },

  /**
   * Search presentations
   */
  async searchPresentations(query: string): Promise<PresentationBase[]> {
    return this.getPresentations({ search: query });
  },

  /**
   * Get presentations by tag
   */
  async getPresentationsByTag(tag: string): Promise<PresentationBase[]> {
    return this.getPresentations({ tag });
  },

  /**
   * Duplicate a slide within a presentation
   */
  async duplicateSlide(presentationId: number, slideId: number): Promise<Slide> {
    // Get the original slide
    const originalSlide = await this.getSlide(presentationId, slideId);
    
    // Get all slides to determine the new order
    const allSlides = await this.getSlides(presentationId);
    const maxOrder = Math.max(...allSlides.map(s => s.order));

    // Create new slide data
    const newSlideData: CreateSlidePayload = {
      slide_type: originalSlide.slide_type,
      order: maxOrder + 1,
      title: `${originalSlide.title} (Copy)`,
      content: originalSlide.content,
      subtitle: originalSlide.subtitle,
      background_color: originalSlide.background_color,
      text_color: originalSlide.text_color,
      font_size: originalSlide.font_size,
      text_align: originalSlide.text_align,
      transition: originalSlide.transition,
      animation: originalSlide.animation,
      custom_css: originalSlide.custom_css,
      layout_config: originalSlide.layout_config,
      notes: originalSlide.notes,
    };

    // Create the new slide
    const newSlide = await this.createSlide(presentationId, newSlideData);

    // Duplicate all elements
    for (const element of originalSlide.elements) {
      const newElementData: CreateSlideElementPayload = {
        element_type: element.element_type,
        order: element.order,
        content: element.content,
        alt_text: element.alt_text,
        x_position: element.x_position,
        y_position: element.y_position,
        width: element.width,
        height: element.height,
        font_family: element.font_family,
        font_size: element.font_size,
        font_weight: element.font_weight,
        color: element.color,
        background_color: element.background_color,
        border_style: element.border_style,
        animation: element.animation,
        animation_delay: element.animation_delay,
        properties: element.properties,
      };

      await this.createSlideElement(presentationId, newSlide.id, newElementData);
    }

    // Return the complete slide with elements
    return this.getSlide(presentationId, newSlide.id);
  },

  /**
   * Reorder slides (helper method)
   */
  async reorderSlides(presentationId: number, slideOrders: Array<{ id: number; order: number }>): Promise<Slide[]> {
    return this.bulkUpdateSlides(presentationId, { slides: slideOrders });
  },
};