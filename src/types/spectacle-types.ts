// src/types/spectacle-types.ts

// Base User type
export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  }
  
  // Slide Element Types
  export interface SlideElement {
    id: number;
    element_type: 'text' | 'heading' | 'image' | 'code' | 'list' | 'link' | 'video' | 'chart' | 'shape';
    order: number;
    content: string;
    alt_text?: string;
    x_position: number;
    y_position: number;
    width: number;
    height: number;
    font_family?: string;
    font_size?: string;
    font_weight?: string;
    color?: string;
    background_color?: string;
    border_style?: string;
    animation?: string;
    animation_delay: number;
    properties: Record<string, unknown>;
  }
  
  // Slide Types
  export interface Slide {
    id: number;
    slide_type: 'title' | 'content' | 'image' | 'code' | 'quote' | 'two_column' | 'list' | 'custom';
    order: number;
    title?: string;
    content?: string;
    subtitle?: string;
    background_color?: string;
    background_image?: string;
    text_color?: string;
    font_size?: string;
    text_align: string;
    transition?: string;
    animation?: string;
    custom_css?: string;
    layout_config: Record<string, unknown>;
    notes?: string;
    elements: SlideElement[];
    created_at: string;
    updated_at: string;
  }
  
  // Presentation Types
  export interface PresentationBase {
    id: number;
    title: string;
    description?: string;
    author: User;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    theme: string;
    tags: string[];
    thumbnail?: string;
    slide_count: number;
  }
  
  export interface PresentationDetail extends PresentationBase {
    template: string;
    transition: string;
    background_color: string;
    text_color: string;
    slides: Slide[];
  }
  
  // Template Types
  export interface PresentationTemplate {
    id: number;
    name: string;
    description?: string;
    author: User;
    theme: string;
    background_color: string;
    text_color: string;
    font_family: string;
    structure: Record<string, unknown>;
    custom_css?: string;
    is_public: boolean;
    created_at: string;
  }
  
  // Create/Update Payload Types
  export interface CreatePresentationPayload {
    title: string;
    description?: string;
    is_public?: boolean;
    theme?: string;
    template?: string;
    transition?: string;
    background_color?: string;
    text_color?: string;
    tags?: string[];
    thumbnail?: File;
  }
  
  export type UpdatePresentationPayload = Partial<CreatePresentationPayload>
  
  export interface CreateSlidePayload {
    slide_type?: 'title' | 'content' | 'image' | 'code' | 'quote' | 'two_column' | 'list' | 'custom';
    order: number;
    title?: string;
    content?: string;
    subtitle?: string;
    background_color?: string;
    background_image?: File;
    text_color?: string;
    font_size?: string;
    text_align?: string;
    transition?: string;
    animation?: string;
    custom_css?: string;
    layout_config?: Record<string, unknown>;
    notes?: string;
  }
  
  export type UpdateSlidePayload = Partial<CreateSlidePayload>
  
  export interface CreateSlideElementPayload {
    element_type: 'text' | 'heading' | 'image' | 'code' | 'list' | 'link' | 'video' | 'chart' | 'shape';
    order: number;
    content: string;
    alt_text?: string;
    x_position?: number;
    y_position?: number;
    width?: number;
    height?: number;
    font_family?: string;
    font_size?: string;
    font_weight?: string;
    color?: string;
    background_color?: string;
    border_style?: string;
    animation?: string;
    animation_delay?: number;
    properties?: Record<string, unknown>;
  }
  
  export type UpdateSlideElementPayload = Partial<CreateSlideElementPayload>
  
  // Clone Payload
  export interface ClonePresentationPayload {
    title: string;
    description?: string;
    is_public?: boolean;
    clone_slides?: boolean;
    clone_elements?: boolean;
  }
  
  // Bulk Update Payload
  export interface BulkSlideUpdatePayload {
    slides: Array<{
      id: number;
      order: number;
    }>;
  }
  
  // Spectacle Export Format
  export interface SpectacleExport {
    metadata: {
      title: string;
      description?: string;
      author: string;
      theme: string;
      template: string;
      transition: string;
      backgroundColor: string;
      textColor: string;
      tags: string[];
      createdAt: string;
      updatedAt: string;
    };
    slides: Array<{
      id: number;
      type: string;
      title?: string;
      content?: string;
      subtitle?: string;
      backgroundColor?: string;
      backgroundImage?: string;
      textColor?: string;
      fontSize?: string;
      textAlign: string;
      transition?: string;
      animation?: string;
      customCSS?: string;
      layoutConfig: Record<string, unknown>;
      notes?: string;
      elements: SlideElement[];
    }>;
  }
  
  // API Response Types
  export interface PaginatedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
  }
  
  // Search/Filter Parameters
  export interface PresentationFilters {
    search?: string;
    author?: number;
    tag?: string;
    is_public?: boolean;
  }
  
  // Error Types
  export interface APIError {
    detail?: string;
    [key: string]: unknown;
  }