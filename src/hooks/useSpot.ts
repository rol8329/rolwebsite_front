import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../services/api/blogApi';
import type { 
  APIError, 
  AudioPost, 
  BasePost, 
  FilePost, 
  ImagePost, 
  VideoPost, 
  CreatePostPayload, 
  UpdatePostPayload, 
  CreateMediaPayload, 
  BasePostGlobal
} from '../types/blog-types';

const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  GC_TIME: 1000 * 60 * 60, // 1 hour
  RETRY: 2,
};

// Query Keys Factory for better organization
export const blogQueryKeys = {
  all: ['blog'] as const,
  globalPosts: () => [...blogQueryKeys.all, 'globalPosts'] as const,
  basePosts: () => [...blogQueryKeys.all, 'basePosts'] as const,
  basePost: (uuid: string) => [...blogQueryKeys.basePosts(), uuid] as const,
  videoPosts: (postUuid: string) => [...blogQueryKeys.all, 'videoPosts', postUuid] as const,
  videoPost: (uuid: string) => [...blogQueryKeys.all, 'videoPost', uuid] as const,
  audioPosts: (postUuid: string) => [...blogQueryKeys.all, 'audioPosts', postUuid] as const,
  audioPost: (uuid: string) => [...blogQueryKeys.all, 'audioPost', uuid] as const,
  imagePosts: (postUuid: string) => [...blogQueryKeys.all, 'imagePosts', postUuid] as const,
  imagePost: (uuid: string) => [...blogQueryKeys.all, 'imagePost', uuid] as const,
  filePosts: (postUuid: string) => [...blogQueryKeys.all, 'filePosts', postUuid] as const,
  filePost: (uuid: string) => [...blogQueryKeys.all, 'filePost', uuid] as const,
};

// Helper function to invalidate related caches
const invalidateRelatedCaches = (queryClient: ReturnType<typeof useQueryClient>, postUuid?: string) => {
  // Always invalidate global posts when any content changes
  queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
  
  if (postUuid) {
    // Invalidate specific base post
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.basePost(postUuid) });
    // Invalidate all media posts for this base post
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.videoPosts(postUuid) });
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.audioPosts(postUuid) });
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.imagePosts(postUuid) });
    queryClient.invalidateQueries({ queryKey: blogQueryKeys.filePosts(postUuid) });
  }
};

// Global Posts Hook
export const useGlobalBasePosts = () =>
  useQuery<BasePostGlobal[], APIError>({
    queryKey: blogQueryKeys.globalPosts(),
    queryFn: blogApi.getGlobalBasePosts,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

// BasePost Hooks
export const useBasePosts = () =>
  useQuery<BasePost[], APIError>({
    queryKey: blogQueryKeys.basePosts(),
    queryFn: blogApi.getBasePosts,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

export const useBasePost = (uuid: string) =>
  useQuery<BasePost, APIError>({
    queryKey: blogQueryKeys.basePost(uuid),
    queryFn: () => blogApi.getBasePost(uuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!uuid,
  });

export const useCreateBasePost = () => {
  const queryClient = useQueryClient();
  return useMutation<BasePost, APIError, CreatePostPayload>({
    mutationFn: blogApi.createBasePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.basePosts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
    },
  });
};

export const useUpdateBasePost = () => {
  const queryClient = useQueryClient();
  return useMutation<BasePost, APIError, { uuid: string; data: UpdatePostPayload }>({
    mutationFn: ({ uuid, data }) => blogApi.updateBasePost(uuid, data),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.basePost(uuid) });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.basePosts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
    },
  });
};

export const useDeleteBasePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, string>({
    mutationFn: blogApi.deleteBasePost,
    onSuccess: (_, uuid) => {
      // Remove specific post from cache
      queryClient.removeQueries({ queryKey: blogQueryKeys.basePost(uuid) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.basePosts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
    },
  });
};

// VideoPost Hooks
export const useVideoPosts = (postUuid: string) =>
  useQuery<VideoPost[], APIError>({
    queryKey: blogQueryKeys.videoPosts(postUuid),
    queryFn: () => blogApi.getVideoPosts(postUuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!postUuid,
  });

export const useVideoPost = (uuid: string) =>
  useQuery<VideoPost, APIError>({
    queryKey: blogQueryKeys.videoPost(uuid),
    queryFn: () => blogApi.getVideoPost(uuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!uuid,
  });

export const useCreateVideoPost = () => {
  const queryClient = useQueryClient();
  return useMutation<VideoPost, APIError, { postUuid: string; data: CreateMediaPayload }>({
    mutationFn: ({ postUuid, data }) => blogApi.createVideoPost(postUuid, data),
    onSuccess: (_, { postUuid }) => {
      invalidateRelatedCaches(queryClient, postUuid);
    },
  });
};

export const useUpdateVideoPost = () => {
  const queryClient = useQueryClient();
  return useMutation<VideoPost, APIError, { uuid: string; data: Partial<VideoPost> }>({
    mutationFn: ({ uuid, data }) => blogApi.updateVideoPost(uuid, data),
    onSuccess: (data, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.videoPost(uuid) });
      // Invalidate the parent post's video list
      if (data.post) {
        invalidateRelatedCaches(queryClient, data.post);
      }
    },
  });
};

export const useDeleteVideoPost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { uuid: string; postUuid?: string }>({
    mutationFn: ({ uuid }) => blogApi.deleteVideoPost(uuid),
    onSuccess: (_, { uuid, postUuid }) => {
      queryClient.removeQueries({ queryKey: blogQueryKeys.videoPost(uuid) });
      if (postUuid) {
        invalidateRelatedCaches(queryClient, postUuid);
      } else {
        // If we don't know the postUuid, invalidate all video queries
        queryClient.invalidateQueries({ queryKey: [...blogQueryKeys.all, 'videoPosts'] });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
      }
    },
  });
};

// AudioPost Hooks
export const useAudioPosts = (postUuid: string) =>
  useQuery<AudioPost[], APIError>({
    queryKey: blogQueryKeys.audioPosts(postUuid),
    queryFn: () => blogApi.getAudioPosts(postUuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!postUuid,
  });

export const useAudioPost = (uuid: string) =>
  useQuery<AudioPost, APIError>({
    queryKey: blogQueryKeys.audioPost(uuid),
    queryFn: () => blogApi.getAudioPost(uuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!uuid,
  });

export const useCreateAudioPost = () => {
  const queryClient = useQueryClient();
  return useMutation<AudioPost, APIError, { postUuid: string; data: CreateMediaPayload }>({
    mutationFn: ({ postUuid, data }) => blogApi.createAudioPost(postUuid, data),
    onSuccess: (_, { postUuid }) => {
      invalidateRelatedCaches(queryClient, postUuid);
    },
  });
};

export const useUpdateAudioPost = () => {
  const queryClient = useQueryClient();
  return useMutation<AudioPost, APIError, { uuid: string; data: Partial<AudioPost> }>({
    mutationFn: ({ uuid, data }) => blogApi.updateAudioPost(uuid, data),
    onSuccess: (data, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.audioPost(uuid) });
      if (data.post) {
        invalidateRelatedCaches(queryClient, data.post);
      }
    },
  });
};

export const useDeleteAudioPost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { uuid: string; postUuid?: string }>({
    mutationFn: ({ uuid }) => blogApi.deleteAudioPost(uuid),
    onSuccess: (_, { uuid, postUuid }) => {
      queryClient.removeQueries({ queryKey: blogQueryKeys.audioPost(uuid) });
      if (postUuid) {
        invalidateRelatedCaches(queryClient, postUuid);
      } else {
        queryClient.invalidateQueries({ queryKey: [...blogQueryKeys.all, 'audioPosts'] });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
      }
    },
  });
};

// ImagePost Hooks
export const useImagePosts = (postUuid: string) =>
  useQuery<ImagePost[], APIError>({
    queryKey: blogQueryKeys.imagePosts(postUuid),
    queryFn: () => blogApi.getImagePosts(postUuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!postUuid,
  });

export const useImagePost = (uuid: string) =>
  useQuery<ImagePost, APIError>({
    queryKey: blogQueryKeys.imagePost(uuid),
    queryFn: () => blogApi.getImagePost(uuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!uuid,
  });

export const useCreateImagePost = () => {
  const queryClient = useQueryClient();
  return useMutation<ImagePost, APIError, { postUuid: string; data: CreateMediaPayload }>({
    mutationFn: ({ postUuid, data }) => blogApi.createImagePost(postUuid, data),
    onSuccess: (_, { postUuid }) => {
      invalidateRelatedCaches(queryClient, postUuid);
    },
  });
};

export const useUpdateImagePost = () => {
  const queryClient = useQueryClient();
  return useMutation<ImagePost, APIError, { uuid: string; data: Partial<ImagePost> }>({
    mutationFn: ({ uuid, data }) => blogApi.updateImagePost(uuid, data),
    onSuccess: (data, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.imagePost(uuid) });
      if (data.post) {
        invalidateRelatedCaches(queryClient, data.post);
      }
    },
  });
};

export const useDeleteImagePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { uuid: string; postUuid?: string }>({
    mutationFn: ({ uuid }) => blogApi.deleteImagePost(uuid),
    onSuccess: (_, { uuid, postUuid }) => {
      queryClient.removeQueries({ queryKey: blogQueryKeys.imagePost(uuid) });
      if (postUuid) {
        invalidateRelatedCaches(queryClient, postUuid);
      } else {
        queryClient.invalidateQueries({ queryKey: [...blogQueryKeys.all, 'imagePosts'] });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
      }
    },
  });
};

// FilePost Hooks
export const useFilePosts = (postUuid: string) =>
  useQuery<FilePost[], APIError>({
    queryKey: blogQueryKeys.filePosts(postUuid),
    queryFn: () => blogApi.getFilePosts(postUuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!postUuid,
  });

export const useFilePost = (uuid: string) =>
  useQuery<FilePost, APIError>({
    queryKey: blogQueryKeys.filePost(uuid),
    queryFn: () => blogApi.getFilePost(uuid),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!uuid,
  });

export const useCreateFilePost = () => {
  const queryClient = useQueryClient();
  return useMutation<FilePost, APIError, { postUuid: string; data: CreateMediaPayload }>({
    mutationFn: ({ postUuid, data }) => blogApi.createFilePost(postUuid, data),
    onSuccess: (_, { postUuid }) => {
      invalidateRelatedCaches(queryClient, postUuid);
    },
  });
};

export const useUpdateFilePost = () => {
  const queryClient = useQueryClient();
  return useMutation<FilePost, APIError, { uuid: string; data: Partial<FilePost> }>({
    mutationFn: ({ uuid, data }) => blogApi.updateFilePost(uuid, data),
    onSuccess: (data, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.filePost(uuid) });
      if (data.post) {
        invalidateRelatedCaches(queryClient, data.post);
      }
    },
  });
};

export const useDeleteFilePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { uuid: string; postUuid?: string }>({
    mutationFn: ({ uuid }) => blogApi.deleteFilePost(uuid),
    onSuccess: (_, { uuid, postUuid }) => {
      queryClient.removeQueries({ queryKey: blogQueryKeys.filePost(uuid) });
      if (postUuid) {
        invalidateRelatedCaches(queryClient, postUuid);
      } else {
        queryClient.invalidateQueries({ queryKey: [...blogQueryKeys.all, 'filePosts'] });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.globalPosts() });
      }
    },
  });
};