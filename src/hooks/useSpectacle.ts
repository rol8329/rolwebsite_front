// src/hooks/useSpectacle.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  PresentationFilters,
  APIError
} from '../types/spectacle-types';
import { spectacleApi } from '@/services/api/spectacleApi';

const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  GC_TIME: 1000 * 60 * 60, // 1 hour
  RETRY: 2,
};

// Query Keys Factory for better organization
export const spectacleQueryKeys = {
  all: ['spectacle'] as const,
  presentations: () => [...spectacleQueryKeys.all, 'presentations'] as const,
  presentation: (id: number) => [...spectacleQueryKeys.presentations(), id] as const,
  presentationExport: (id: number) => [...spectacleQueryKeys.presentation(id), 'export'] as const,
  slides: (presentationId: number) => [...spectacleQueryKeys.presentation(presentationId), 'slides'] as const,
  slide: (presentationId: number, slideId: number) => [...spectacleQueryKeys.slides(presentationId), slideId] as const,
  slideElements: (presentationId: number, slideId: number) => [...spectacleQueryKeys.slide(presentationId, slideId), 'elements'] as const,
  slideElement: (presentationId: number, slideId: number, elementId: number) => [...spectacleQueryKeys.slideElements(presentationId, slideId), elementId] as const,
  templates: () => [...spectacleQueryKeys.all, 'templates'] as const,
  template: (id: number) => [...spectacleQueryKeys.templates(), id] as const,
  // Filtered queries
  presentationsFiltered: (filters: PresentationFilters) => [...spectacleQueryKeys.presentations(), 'filtered', filters] as const,
  publicPresentations: () => [...spectacleQueryKeys.presentations(), 'public'] as const,
  myPresentations: () => [...spectacleQueryKeys.presentations(), 'my'] as const,
  searchPresentations: (query: string) => [...spectacleQueryKeys.presentations(), 'search', query] as const,
  presentationsByTag: (tag: string) => [...spectacleQueryKeys.presentations(), 'tag', tag] as const,
};

// Helper function to invalidate related caches
const invalidateRelatedCaches = (queryClient: ReturnType<typeof useQueryClient>, presentationId?: number, slideId?: number) => {
  // Always invalidate all presentations when any content changes
  queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.presentations() });
  
  if (presentationId) {
    // Invalidate specific presentation
    queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.presentation(presentationId) });
    // Invalidate slides for this presentation
    queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.slides(presentationId) });
    
    if (slideId) {
      // Invalidate specific slide
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.slide(presentationId, slideId) });
      // Invalidate elements for this slide
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.slideElements(presentationId, slideId) });
    }
  }
};

// ===========================
// PRESENTATION HOOKS
// ===========================

export const usePresentations = (filters?: PresentationFilters) =>
  useQuery<PresentationBase[], APIError>({
    queryKey: filters ? spectacleQueryKeys.presentationsFiltered(filters) : spectacleQueryKeys.presentations(),
    queryFn: () => spectacleApi.getPresentations(filters),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

export const usePresentation = (id: number) =>
  useQuery<PresentationDetail, APIError>({
    queryKey: spectacleQueryKeys.presentation(id),
    queryFn: () => spectacleApi.getPresentation(id),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!id,
  });

export const useCreatePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation<PresentationDetail, APIError, CreatePresentationPayload>({
    mutationFn: spectacleApi.createPresentation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.presentations() });
    },
  });
};

export const useUpdatePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation<PresentationDetail, APIError, { id: number; data: UpdatePresentationPayload }>({
    mutationFn: ({ id, data }) => spectacleApi.updatePresentation(id, data),
    onSuccess: (_, { id }) => {
      invalidateRelatedCaches(queryClient, id);
    },
  });
};

export const useDeletePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, number>({
    mutationFn: spectacleApi.deletePresentation,
    onSuccess: (_, id) => {
      // Remove specific presentation from cache
      queryClient.removeQueries({ queryKey: spectacleQueryKeys.presentation(id) });
      // Invalidate presentations list
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.presentations() });
    },
  });
};

export const useClonePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation<PresentationDetail, APIError, { id: number; data: ClonePresentationPayload }>({
    mutationFn: ({ id, data }) => spectacleApi.clonePresentation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.presentations() });
    },
  });
};

export const useExportPresentation = (id: number) =>
  useQuery<SpectacleExport, APIError>({
    queryKey: spectacleQueryKeys.presentationExport(id),
    queryFn: () => spectacleApi.exportPresentation(id),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!id,
  });

// ===========================
// SLIDE HOOKS
// ===========================

export const useSlides = (presentationId: number) =>
  useQuery<Slide[], APIError>({
    queryKey: spectacleQueryKeys.slides(presentationId),
    queryFn: () => spectacleApi.getSlides(presentationId),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!presentationId,
  });

export const useSlide = (presentationId: number, slideId: number) =>
  useQuery<Slide, APIError>({
    queryKey: spectacleQueryKeys.slide(presentationId, slideId),
    queryFn: () => spectacleApi.getSlide(presentationId, slideId),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!presentationId && !!slideId,
  });

export const useCreateSlide = () => {
  const queryClient = useQueryClient();
  return useMutation<Slide, APIError, { presentationId: number; data: CreateSlidePayload }>({
    mutationFn: ({ presentationId, data }) => spectacleApi.createSlide(presentationId, data),
    onSuccess: (_, { presentationId }) => {
      invalidateRelatedCaches(queryClient, presentationId);
    },
  });
};

export const useUpdateSlide = () => {
  const queryClient = useQueryClient();
  return useMutation<Slide, APIError, { presentationId: number; slideId: number; data: UpdateSlidePayload }>({
    mutationFn: ({ presentationId, slideId, data }) => spectacleApi.updateSlide(presentationId, slideId, data),
    onSuccess: (_, { presentationId, slideId }) => {
      invalidateRelatedCaches(queryClient, presentationId, slideId);
    },
  });
};

export const useDeleteSlide = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { presentationId: number; slideId: number }>({
    mutationFn: ({ presentationId, slideId }) => spectacleApi.deleteSlide(presentationId, slideId),
    onSuccess: (_, { presentationId, slideId }) => {
      // Remove specific slide from cache
      queryClient.removeQueries({ queryKey: spectacleQueryKeys.slide(presentationId, slideId) });
      // Invalidate related caches
      invalidateRelatedCaches(queryClient, presentationId);
    },
  });
};

export const useBulkUpdateSlides = () => {
  const queryClient = useQueryClient();
  return useMutation<Slide[], APIError, { presentationId: number; data: BulkSlideUpdatePayload }>({
    mutationFn: ({ presentationId, data }) => spectacleApi.bulkUpdateSlides(presentationId, data),
    onSuccess: (_, { presentationId }) => {
      invalidateRelatedCaches(queryClient, presentationId);
    },
  });
};

export const useDuplicateSlide = () => {
  const queryClient = useQueryClient();
  return useMutation<Slide, APIError, { presentationId: number; slideId: number }>({
    mutationFn: ({ presentationId, slideId }) => spectacleApi.duplicateSlide(presentationId, slideId),
    onSuccess: (_, { presentationId }) => {
      invalidateRelatedCaches(queryClient, presentationId);
    },
  });
};

// ===========================
// SLIDE ELEMENT HOOKS
// ===========================

export const useSlideElements = (presentationId: number, slideId: number) =>
  useQuery<SlideElement[], APIError>({
    queryKey: spectacleQueryKeys.slideElements(presentationId, slideId),
    queryFn: () => spectacleApi.getSlideElements(presentationId, slideId),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!presentationId && !!slideId,
  });

export const useSlideElement = (presentationId: number, slideId: number, elementId: number) =>
  useQuery<SlideElement, APIError>({
    queryKey: spectacleQueryKeys.slideElement(presentationId, slideId, elementId),
    queryFn: () => spectacleApi.getSlideElement(presentationId, slideId, elementId),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!presentationId && !!slideId && !!elementId,
  });

export const useCreateSlideElement = () => {
  const queryClient = useQueryClient();
  return useMutation<SlideElement, APIError, { presentationId: number; slideId: number; data: CreateSlideElementPayload }>({
    mutationFn: ({ presentationId, slideId, data }) => spectacleApi.createSlideElement(presentationId, slideId, data),
    onSuccess: (_, { presentationId, slideId }) => {
      invalidateRelatedCaches(queryClient, presentationId, slideId);
    },
  });
};

export const useUpdateSlideElement = () => {
  const queryClient = useQueryClient();
  return useMutation<SlideElement, APIError, { presentationId: number; slideId: number; elementId: number; data: UpdateSlideElementPayload }>({
    mutationFn: ({ presentationId, slideId, elementId, data }) => spectacleApi.updateSlideElement(presentationId, slideId, elementId, data),
    onSuccess: (_, { presentationId, slideId, elementId }) => {
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.slideElement(presentationId, slideId, elementId) });
      invalidateRelatedCaches(queryClient, presentationId, slideId);
    },
  });
};

export const useDeleteSlideElement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, { presentationId: number; slideId: number; elementId: number }>({
    mutationFn: ({ presentationId, slideId, elementId }) => spectacleApi.deleteSlideElement(presentationId, slideId, elementId),
    onSuccess: (_, { presentationId, slideId, elementId }) => {
      // Remove specific element from cache
      queryClient.removeQueries({ queryKey: spectacleQueryKeys.slideElement(presentationId, slideId, elementId) });
      // Invalidate related caches
      invalidateRelatedCaches(queryClient, presentationId, slideId);
    },
  });
};

// ===========================
// TEMPLATE HOOKS
// ===========================

export const useTemplates = () =>
  useQuery<PresentationTemplate[], APIError>({
    queryKey: spectacleQueryKeys.templates(),
    queryFn: spectacleApi.getTemplates,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<PresentationTemplate, APIError, Partial<PresentationTemplate>>({
    mutationFn: spectacleApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.templates() });
    },
  });
};

// ===========================
// UTILITY HOOKS
// ===========================

export const useMyPresentations = () =>
  useQuery<PresentationBase[], APIError>({
    queryKey: spectacleQueryKeys.myPresentations(),
    queryFn: spectacleApi.getMyPresentations,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

export const usePublicPresentations = () =>
  useQuery<PresentationBase[], APIError>({
    queryKey: spectacleQueryKeys.publicPresentations(),
    queryFn: spectacleApi.getPublicPresentations,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
  });

export const useSearchPresentations = (query: string) =>
  useQuery<PresentationBase[], APIError>({
    queryKey: spectacleQueryKeys.searchPresentations(query),
    queryFn: () => spectacleApi.searchPresentations(query),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!query && query.length > 2, // Only search if query is at least 3 characters
  });

export const usePresentationsByTag = (tag: string) =>
  useQuery<PresentationBase[], APIError>({
    queryKey: spectacleQueryKeys.presentationsByTag(tag),
    queryFn: () => spectacleApi.getPresentationsByTag(tag),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY,
    enabled: !!tag,
  });

// ===========================
// OPTIMISTIC UPDATE HOOKS
// ===========================

export const useOptimisticSlideReorder = () => {
  const queryClient = useQueryClient();
  const bulkUpdateMutation = useBulkUpdateSlides();

  const reorderSlides = (presentationId: number, slideOrders: Array<{ id: number; order: number }>) => {
    // Optimistically update the cache
    queryClient.setQueryData<Slide[]>(
      spectacleQueryKeys.slides(presentationId),
      (oldSlides) => {
        if (!oldSlides) return oldSlides;
        
        const reorderedSlides = [...oldSlides];
        slideOrders.forEach(({ id, order }) => {
          const slideIndex = reorderedSlides.findIndex(slide => slide.id === id);
          if (slideIndex !== -1) {
            reorderedSlides[slideIndex] = { ...reorderedSlides[slideIndex], order };
          }
        });
        
        return reorderedSlides.sort((a, b) => a.order - b.order);
      }
    );

    // Perform the actual mutation
    return bulkUpdateMutation.mutate(
      { presentationId, data: { slides: slideOrders } },
      {
        onError: () => {
          // Revert on error
          queryClient.invalidateQueries({ queryKey: spectacleQueryKeys.slides(presentationId) });
        }
      }
    );
  };

  return {
    reorderSlides,
    ...bulkUpdateMutation,
  };
};

// ===========================
// COMBINED HOOKS FOR COMPLEX OPERATIONS
// ===========================

export const usePresentationWithSlides = (presentationId: number) => {
  const presentationQuery = usePresentation(presentationId);
  const slidesQuery = useSlides(presentationId);

  return {
    presentation: presentationQuery.data,
    slides: slidesQuery.data,
    isLoading: presentationQuery.isLoading || slidesQuery.isLoading,
    isError: presentationQuery.isError || slidesQuery.isError,
    error: presentationQuery.error || slidesQuery.error,
    refetch: () => {
      presentationQuery.refetch();
      slidesQuery.refetch();
    },
  };
};

export const useSlideWithElements = (presentationId: number, slideId: number) => {
  const slideQuery = useSlide(presentationId, slideId);
  const elementsQuery = useSlideElements(presentationId, slideId);

  return {
    slide: slideQuery.data,
    elements: elementsQuery.data,
    isLoading: slideQuery.isLoading || elementsQuery.isLoading,
    isError: slideQuery.isError || elementsQuery.isError,
    error: slideQuery.error || elementsQuery.error,
    refetch: () => {
      slideQuery.refetch();
      elementsQuery.refetch();
    },
  };
};

// ===========================
// PREFETCH UTILITIES
// ===========================

export const usePrefetchPresentation = () => {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: spectacleQueryKeys.presentation(id),
      queryFn: () => spectacleApi.getPresentation(id),
      staleTime: QUERY_CONFIG.STALE_TIME,
    });
  };
};

export const usePrefetchSlides = () => {
  const queryClient = useQueryClient();

  return (presentationId: number) => {
    queryClient.prefetchQuery({
      queryKey: spectacleQueryKeys.slides(presentationId),
      queryFn: () => spectacleApi.getSlides(presentationId),
      staleTime: QUERY_CONFIG.STALE_TIME,
    });
  };
};

// ===========================
// EXPORT ALL HOOKS
// ===========================

// Main export object for convenience
export const useSpectacle = {
  // Presentations
  presentations: usePresentations,
  presentation: usePresentation,
  createPresentation: useCreatePresentation,
  updatePresentation: useUpdatePresentation,
  deletePresentation: useDeletePresentation,
  clonePresentation: useClonePresentation,
  exportPresentation: useExportPresentation,

  // Slides
  slides: useSlides,
  slide: useSlide,
  createSlide: useCreateSlide,
  updateSlide: useUpdateSlide,
  deleteSlide: useDeleteSlide,
  bulkUpdateSlides: useBulkUpdateSlides,
  duplicateSlide: useDuplicateSlide,

  // Elements
  slideElements: useSlideElements,
  slideElement: useSlideElement,
  createSlideElement: useCreateSlideElement,
  updateSlideElement: useUpdateSlideElement,
  deleteSlideElement: useDeleteSlideElement,

  // Templates
  templates: useTemplates,
  createTemplate: useCreateTemplate,

  // Utilities
  myPresentations: useMyPresentations,
  publicPresentations: usePublicPresentations,
  searchPresentations: useSearchPresentations,
  presentationsByTag: usePresentationsByTag,

  // Combined
  presentationWithSlides: usePresentationWithSlides,
  slideWithElements: useSlideWithElements,

  // Optimistic
  optimisticSlideReorder: useOptimisticSlideReorder,

  // Prefetch
  prefetchPresentation: usePrefetchPresentation,
  prefetchSlides: usePrefetchSlides,
};