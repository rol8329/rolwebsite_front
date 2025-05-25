// src/components/auth/AuthGuard.tsx
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: 'reader' | 'creator' | 'owner';
  requiredPermissionLevel?: number;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = <div>Please log in to access this content.</div>,
  requiredRole,
  requiredPermissionLevel,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check role requirement
  if (requiredRole) {
    const roleHierarchy = { reader: 1, creator: 2, owner: 3 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return <div>You dont have permission to access this content.</div>;
    }
  }

  // Check permission level requirement
  if (requiredPermissionLevel && user.permissions_level < requiredPermissionLevel) {
    return <div>You dont have sufficient permissions to access this content.</div>;
  }

  return <>{children}</>;
};