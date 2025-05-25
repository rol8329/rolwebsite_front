// src/app/spectacle/create/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { CreatePresentationForm } from '@/components/spectacle/CreatePresentationForm';

const CreatePresentationPage: React.FC = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSuccess = (presentation: unknown) => {
    const presentationWithId = presentation as { id: string };
    // Navigate to the new presentation's edit page
    router.push(`/spectacle/presentations/${presentationWithId.id}/edit`);
  };

  const handleCancel = () => {
    router.push('/spectacle');
  };

  const handleAuthAction = (action: 'login' | 'register' | 'profile' | 'settings' | 'changePassword') => {
    console.log('Auth action:', action);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <NavigationMenu 
        isMobile={isMobile} 
        currentPage="spectacle"
        onAuthAction={handleAuthAction}
      />
      
      <div style={{ padding: '24px' }}>
        <CreatePresentationForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreatePresentationPage;