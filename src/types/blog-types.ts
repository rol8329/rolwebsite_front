// Base types
export interface BasePost {
  uuid: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  actif: boolean;
}

// Individual media post types (include 'post' field for standalone operations)
export interface VideoPost {
  uuid: string;
  post: string;
  label: string;
  video: string;
}

export interface AudioPost {
  uuid: string;
  post: string;
  label: string;
  audio: string;
}

export interface FilePost {
  uuid: string;
  post: string;
  label: string;
  file: string;
}

export interface ImagePost {
  uuid: string;
  post: string;
  label: string;
  image: string;
}

// Global media post types (exclude 'post' field, used in BasePostGlobal)
export interface VideoPostGlobal {
  uuid: string;
  label: string;
  video: string;
}

export interface AudioPostGlobal {
  uuid: string;
  label: string;
  audio: string;
}

export interface FilePostGlobal {
  uuid: string;
  label: string;
  file: string;
}

export interface ImagePostGlobal {
  uuid: string;
  label: string;
  image: string;
}

// API Error type
export interface APIError {
  message: string;
  status: number;
}

// Payload types for creation and update
export type CreatePostPayload = Omit<BasePost, 'uuid' | 'created_at' | 'updated_at'>;

export type UpdatePostPayload = Partial<CreatePostPayload>;

export type CreateMediaPayload = {
  label: string;
  file: File;
};

export type UpdateMediaPayload = Partial<CreateMediaPayload>;

// Global BasePost with all related media
export interface BasePostGlobal {
  uuid: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  actif: boolean;
  postImagePost: ImagePostGlobal[];
  postVideoPost: VideoPostGlobal[];
  postAudioPost: AudioPostGlobal[];
  postFilePost: FilePostGlobal[];
}

// Union types for convenience
export type MediaPost = VideoPost | AudioPost | FilePost | ImagePost;
export type MediaPostGlobal = VideoPostGlobal | AudioPostGlobal | FilePostGlobal | ImagePostGlobal;