import { axiosAuthInstance, axiosPublicInstance } from './client';
import { API_URL } from '../../config/constants';
import type { 
  AudioPost, 
  BasePost, 
  FilePost, 
  ImagePost, 
  VideoPost, 
  CreatePostPayload, 
  CreateMediaPayload, 
  UpdatePostPayload, 
  BasePostGlobal
} from '../../types/blog-types';

const BASE_URL = `${API_URL}/posts`;

export const blogApi = {
  /**
   * Fetch all global BasePosts with their related Images, Videos, Audios, and Files
   */
  async getGlobalBasePosts(): Promise<BasePostGlobal[]> {
    try {
      const response = await axiosPublicInstance.get(`${BASE_URL}/global/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching global posts:', error);
      return [];
    }
  },

  // BasePost Endpoints
  async getBasePosts(): Promise<BasePost[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/`);
    return response.data;
  },
  
  async createBasePost(data: CreatePostPayload): Promise<BasePost> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/`, data);
    return response.data;
  },

  async getBasePost(uuid: string): Promise<BasePost> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${uuid}/`);
    return response.data;
  },

  async updateBasePost(uuid: string, data: UpdatePostPayload): Promise<BasePost> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/${uuid}/`, data);
    return response.data;
  },

  async deleteBasePost(uuid: string): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/${uuid}/`);
  },

  // VideoPost Endpoints
  async getVideoPosts(postUuid: string): Promise<VideoPost[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${postUuid}/videos/`);
    return response.data;
  },

  async createVideoPost(postUuid: string, data: CreateMediaPayload): Promise<VideoPost> {
    const formData = new FormData();
    formData.append('label', data.label);
    formData.append('video', data.file); // Fixed: use 'video' not 'file'

    const response = await axiosAuthInstance.post(`${BASE_URL}/${postUuid}/videos/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getVideoPost(uuid: string): Promise<VideoPost> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/videos/${uuid}/`);
    return response.data;
  },

  async updateVideoPost(uuid: string, data: Partial<VideoPost>): Promise<VideoPost> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/videos/${uuid}/`, data);
    return response.data;
  },

  async deleteVideoPost(uuid: string): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/videos/${uuid}/`);
  },

  // AudioPost Endpoints
  async getAudioPosts(postUuid: string): Promise<AudioPost[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${postUuid}/audios/`);
    return response.data;
  },

  async createAudioPost(postUuid: string, data: CreateMediaPayload): Promise<AudioPost> {
    const formData = new FormData();
    formData.append('label', data.label);
    formData.append('audio', data.file); // Fixed: use 'audio' not 'file'

    const response = await axiosAuthInstance.post(`${BASE_URL}/${postUuid}/audios/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getAudioPost(uuid: string): Promise<AudioPost> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/audios/${uuid}/`);
    return response.data;
  },

  async updateAudioPost(uuid: string, data: Partial<AudioPost>): Promise<AudioPost> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/audios/${uuid}/`, data);
    return response.data;
  },

  async deleteAudioPost(uuid: string): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/audios/${uuid}/`);
  },

  // FilePost Endpoints
  async getFilePosts(postUuid: string): Promise<FilePost[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${postUuid}/files/`);
    return response.data;
  },

  async createFilePost(postUuid: string, data: CreateMediaPayload): Promise<FilePost> {
    const formData = new FormData();
    formData.append('label', data.label);
    formData.append('file', data.file); // Correct: FilePost uses 'file'

    const response = await axiosAuthInstance.post(`${BASE_URL}/${postUuid}/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getFilePost(uuid: string): Promise<FilePost> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/files/${uuid}/`);
    return response.data;
  },

  async updateFilePost(uuid: string, data: Partial<FilePost>): Promise<FilePost> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/files/${uuid}/`, data);
    return response.data;
  },

  async deleteFilePost(uuid: string): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/files/${uuid}/`);
  },

  // ImagePost Endpoints
  async getImagePosts(postUuid: string): Promise<ImagePost[]> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/${postUuid}/images/`);
    return response.data;
  },

  async createImagePost(postUuid: string, data: CreateMediaPayload): Promise<ImagePost> {
    const formData = new FormData();
    formData.append('label', data.label);
    formData.append('image', data.file); // Correct: ImagePost uses 'image'

    const response = await axiosAuthInstance.post(`${BASE_URL}/${postUuid}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getImagePost(uuid: string): Promise<ImagePost> {
    const response = await axiosPublicInstance.get(`${BASE_URL}/images/${uuid}/`);
    return response.data;
  },

  async updateImagePost(uuid: string, data: Partial<ImagePost>): Promise<ImagePost> {
    const response = await axiosAuthInstance.put(`${BASE_URL}/images/${uuid}/`, data);
    return response.data;
  },

  async deleteImagePost(uuid: string): Promise<void> {
    await axiosAuthInstance.delete(`${BASE_URL}/images/${uuid}/`);
  },
};