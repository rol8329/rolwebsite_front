// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi } from '../services/api/authApi';
import { setTokens, clearTokens } from '../services/api/client';
import type {
  AuthState,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth-types';

// Type guard for API errors
interface APIError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
  };
  message?: string;
}

function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === 'object' && 
    error !== null && 
    ('response' in error || 'message' in error)
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAPIError(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from stored tokens
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Try to get user profile with stored token
      const user = await authApi.getProfile();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      console.log('No valid authentication found', error);
      await clearTokens();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeAuth();
    } else {
      // Server-side: set not loading
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [initializeAuth]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.login(credentials);
      
      // Store tokens
      await setTokens(response.access, response.refresh);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Login failed');
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.register(data);
      
      // Store tokens
      await setTokens(response.access, response.refresh);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Registration failed');
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Get current refresh token from storage
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error: unknown) {
      console.error('Server logout failed:', error);
      // Continue with local logout
    } finally {
      await clearTokens();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.updateProfile(data);
      
      setAuthState(prev => ({
        ...prev,
        user: response.user,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Profile update failed');
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      
      await authApi.changePassword(data);
      
      // Password changed successfully - could optionally force re-login
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Password change failed');
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      
      await authApi.forgotPassword(data);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to send reset email');
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (data: ResetPasswordData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      
      await authApi.resetPassword(data);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Password reset failed');
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Cancel account
  const cancelAccount = useCallback(async (password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, error: null }));
      
      await authApi.cancelAccount(password);
      
      // Clear auth state after successful account deletion
      await clearTokens();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Account cancellation failed');
      
      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Refresh user data
  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      const user = await authApi.getProfile();
      setAuthState(prev => ({ ...prev, user }));
    } catch (error: unknown) {
      console.error('Failed to refresh user data:', error);
    }
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    cancelAccount,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};