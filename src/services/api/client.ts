// src/services/api/client.ts - FIXED VERSION
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { APIResponse, LoginCredentials, Nullable } from '../../types/auth-types';
import { storageService } from '../storage/storage';
import { API_URL } from '../../config/constants';

// State variables
let accessToken: Nullable<string> = null;
let refreshToken: Nullable<string> = null;
let tokenFetchPromise: Nullable<Promise<string | null>> = null;
let isInitialized = false;

// Public endpoints that should NEVER send auth tokens
const PUBLIC_ENDPOINTS = [
  '/api/blog/posts/',  // Your blog posts endpoint
  '/api/account/auth/login/',
  '/api/account/auth/register/',
  '/api/account/auth/refresh/',
  '/api/account/auth/logout/',
];

// Check if endpoint is public
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Initialize tokens from local storage - safely
const initializeTokens = async (): Promise<void> => {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }
  
  try {
    accessToken = await storageService.getItem('accessToken');
    refreshToken = await storageService.getItem('refreshToken');
    isInitialized = true;
    console.log('🔑 Tokens initialized:', {
      hasAccess: !!accessToken,
      hasRefresh: !!refreshToken
    });
  } catch (error) {
    console.error('Error initializing tokens:', error);
  }
};

// Safe initialization call
if (typeof window !== 'undefined') {
  initializeTokens();
}

// Function to get a new access token
export const getAccessToken = async (forceRefresh = false): Promise<string | null> => {
  if (!isInitialized && typeof window !== 'undefined') {
    await initializeTokens();
  }

  if (!forceRefresh && accessToken) {
    return accessToken;
  }

  if (tokenFetchPromise) {
    console.log('Using existing token fetch promise');
    return tokenFetchPromise;
  }

  tokenFetchPromise = (async (): Promise<string | null> => {
    try {
      if (!refreshToken) {
        console.log('No refresh token available');
        return null;
      }

      console.log('🔄 Refreshing access token');
      const response: AxiosResponse<APIResponse> = await axios.post(`${API_URL}/api/account/auth/refresh/`, {
        refresh: refreshToken,
      });

      accessToken = response.data.access;
      
      if (typeof window !== 'undefined') {
        await storageService.setItem('accessToken', accessToken);
      }

      console.log('✅ Token refreshed successfully');
      return accessToken;
    } catch (error) {
      console.error('❌ Failed to refresh access token:', error);
      accessToken = null;
      refreshToken = null;
      
      if (typeof window !== 'undefined') {
        await Promise.all([
          storageService.removeItem('accessToken'),
          storageService.removeItem('refreshToken'),
        ]);
      }
      return null;
    } finally {
      tokenFetchPromise = null;
    }
  })();

  return await tokenFetchPromise;
};

// Function to login and retrieve tokens
export const login = async (credentials: LoginCredentials): Promise<APIResponse> => {
  try {
    const response: AxiosResponse<APIResponse> = await axios.post(`${API_URL}/api/account/auth/login/`, credentials);

    accessToken = response.data.access;
    refreshToken = response.data.refresh;

    if (typeof window !== 'undefined') {
      await Promise.all([
        storageService.setItem('accessToken', accessToken),
        storageService.setItem('refreshToken', refreshToken),
      ]);
    }

    console.log('✅ Login successful');
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

// Function to logout and clear tokens
export const logout = async (): Promise<void> => {
  if (refreshToken && typeof window !== 'undefined') {
    try {
      await axios.post(`${API_URL}/api/account/auth/logout/`, {
        refresh: refreshToken
      });
    } catch (error) {
      console.error('Server logout failed:', error);
    }
  }

  accessToken = null;
  refreshToken = null;
  
  if (typeof window !== 'undefined') {
    await Promise.all([
      storageService.removeItem('accessToken'),
      storageService.removeItem('refreshToken'),
    ]);
  }
  console.log('🚪 Logged out');
};

// Function to set tokens
export const setTokens = async (access: string, refresh: string): Promise<void> => {
  accessToken = access;
  refreshToken = refresh;

  if (typeof window !== 'undefined') {
    await Promise.all([
      storageService.setItem('accessToken', access),
      storageService.setItem('refreshToken', refresh),
    ]);
  }
};

// Function to clear tokens
export const clearTokens = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;

  if (typeof window !== 'undefined') {
    await Promise.all([
      storageService.removeItem('accessToken'),
      storageService.removeItem('refreshToken'),
    ]);
  }
};

// Create authenticated axios instance
const createAuthenticatedInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - ONLY for authenticated requests
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // Skip auth for public endpoints
    if (isPublicEndpoint(config.url || '')) {
      console.log('🌐 Public endpoint - skipping auth:', config.url);
      return config;
    }

    // Ensure tokens are initialized
    if (!isInitialized && typeof window !== 'undefined') {
      await initializeTokens();
    }

    // Add token for authenticated endpoints
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('🔐 Added auth token to request:', config.url);
    } else if (typeof window !== 'undefined') {
      console.log('🔄 No access token, attempting refresh for:', config.url);
      try {
        const token = await getAccessToken(true);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Added refreshed token to request');
        } else {
          console.log('❌ No token available for authenticated request');
        }
      } catch (error) {
        console.error('❌ Failed to get token for request:', error);
      }
    }

    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('✅ Request successful:', response.config.url, response.status);
      return response;
    },
    async (error) => {
      console.error('❌ Request failed:', error.config?.url, error.response?.status);
      
      // Only handle auth errors client-side and for non-public endpoints
      if (typeof window !== 'undefined' && 
          error.response?.status === 401 && 
          !isPublicEndpoint(error.config?.url || '') && 
          refreshToken) {
        
        console.log('🔄 401 on authenticated endpoint, attempting refresh');
        try {
          const newToken = await getAccessToken(true);
          if (newToken) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return instance.request(error.config);
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          await logout();
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create public axios instance (never sends auth tokens)
const createPublicInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Simple logging interceptors
  instance.interceptors.request.use((config) => {
    console.log('🌐 Public request:', config.method?.toUpperCase(), config.url);
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      console.log('✅ Public response:', response.status);
      return response;
    },
    (error) => {
      console.error('❌ Public request failed:', error.response?.status);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export different instances for different use cases
export const axiosAuthInstance = createAuthenticatedInstance();
export const axiosPublicInstance = createPublicInstance();

// Default export is the smart instance that handles both
export default axiosAuthInstance;