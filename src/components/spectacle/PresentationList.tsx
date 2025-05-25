// src/components/spectacle/PresentationList.tsx
import React  from 'react';
import { PresentationFilters } from '../../types/spectacle-types';
import { usePresentations, useDeletePresentation, useClonePresentation } from '../../hooks/useSpectacle';
import { PresentationCard } from './PresentationCard';

interface PresentationListProps {
  searchQuery?: string;
  showPublicOnly?: boolean;
  authorId?: number;
}

export const PresentationList: React.FC<PresentationListProps> = ({
  searchQuery,
  showPublicOnly = false,
  authorId
}) => {
  const filters: PresentationFilters = {
    search: searchQuery,
    is_public: showPublicOnly ? true : undefined,
    author: authorId
  };

  const { data: presentations = [], isLoading, error, refetch } = usePresentations(filters);
  const deletePresentation = useDeletePresentation();
  const clonePresentation = useClonePresentation();

  const handleDelete = async (id: number) => {
    deletePresentation.mutate(id, {
      onError: (error) => {
        console.error('Error deleting presentation:', error);
        alert('Failed to delete presentation');
      }
    });
  };

  const handleClone = async (id: number) => {
    const cloneData = {
      title: `Cloned Presentation - ${Date.now()}`,
      clone_slides: true,
      clone_elements: true
    };
    
    clonePresentation.mutate({ id, data: cloneData }, {
      onError: (error) => {
        console.error('Error cloning presentation:', error);
        alert('Failed to clone presentation');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load presentations</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (presentations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No presentations found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {presentations.map((presentation) => (
        <PresentationCard
          key={presentation.id}
          presentation={presentation}
          onDelete={handleDelete}
          onClone={handleClone}
          isDeleting={deletePresentation.isPending}
          isCloning={clonePresentation.isPending}
        />
      ))}
    </div>
  );
};