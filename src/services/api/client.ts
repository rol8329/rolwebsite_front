import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { APIResponse, LoginCredentials, Nullable } from '../../types/auth-types';
import { storageService } from '../storage/storage';
import { API_URL } from '../../config/constants';

// State variables
let accessToken: Nullable<string> = null;
let refreshToken: Nullable<string> = null;
let tokenFetchPromise: Nullable<Promise<string | null>> = null;
let isInitialized = false;

// Initialize tokens from local storage - safely
const initializeTokens = async (): Promise<void> => {
  // Skip if already initialized or in server environment
  if (isInitialized || typeof window === 'undefined') {
    return;
  }
  
  try {
    accessToken = await storageService.getItem('accessToken');
    refreshToken = await storageService.getItem('refreshToken');
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing tokens:', error);
  }
};

// Safe initialization call - won't run on server
if (typeof window !== 'undefined') {
  initializeTokens();
}

// Function to get a new access token
// In src/services/api/client.ts - modify the getAccessToken function

export const getAccessToken = async (forceRefresh = false): Promise<string | null> => {
  // Ensure tokens are initialized if we're client-side
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

  // Fix: Correctly type the promise
  tokenFetchPromise = (async (): Promise<string | null> => {
    try {
      // Don't throw an error if no refresh token - just return null
      if (!refreshToken) {
        console.log('No refresh token available - user likely not logged in yet');
        return null; // Return null instead of throwing
      }

      console.log('Refreshing access token');
      const response: AxiosResponse<APIResponse> = await axios.post(`${API_URL}/acount-api/token/refresh/`, {
        refresh: refreshToken,
      });

      accessToken = response.data.access;
      
      // Only try to store if we're client-side
      if (typeof window !== 'undefined') {
        await storageService.setItem('accessToken', accessToken);
      }

      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      accessToken = null;
      refreshToken = null;
      
      // Only try to remove storage if we're client-side
      if (typeof window !== 'undefined') {
        await Promise.all([
          storageService.removeItem('accessToken'),
          storageService.removeItem('refreshToken'),
        ]);
      }
      return null; // Return null instead of throwing
    } finally {
      tokenFetchPromise = null;
    }
  })();

  return await tokenFetchPromise;
};

// Function to login and retrieve tokens
export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    const response: AxiosResponse<APIResponse> = await axios.post(`${API_URL}/acount-api/token/`, credentials);

    accessToken = response.data.access;
    refreshToken = response.data.refresh;

    // Store tokens only client-side
    if (typeof window !== 'undefined') {
      await Promise.all([
        storageService.setItem('accessToken', accessToken),
        storageService.setItem('refreshToken', refreshToken),
      ]);
    }

    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Function to logout and clear tokens
export const logout = async (): Promise<void> => {
  accessToken = null;
  refreshToken = null;
  
  // Remove from storage only client-side
  if (typeof window !== 'undefined') {
    await Promise.all([
      storageService.removeItem('accessToken'),
      storageService.removeItem('refreshToken'),
    ]);
  }
  console.log('Logged out');
};

// Create and initialize axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to attach access token
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // Ensure tokens are initialized if we're client-side
    if (!isInitialized && typeof window !== 'undefined') {
      await initializeTokens();
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (typeof window !== 'undefined') {
      // Only try to refresh token client-side
      console.log('No access token found, attempting to refresh');
      try {
        const token = await getAccessToken(true);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get token for request:', error);
      }
    }

    return config;
  });

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      // Only handle auth errors client-side
      if (typeof window !== 'undefined' && error.response?.status === 401 && refreshToken) {
        console.log('Access token expired, attempting refresh');
        try {
          const newToken = await getAccessToken(true);
          if (newToken) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return instance.request(error.config);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          await logout(); // Logout if refresh fails
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create proxy objects for axios instances that handle server/client differences
// This approach maintains API compatibility with existing code
function createApiProxy(): AxiosInstance {
  const instance = createAxiosInstance();
  
  // For server-side rendering, return a basic instance
  if (typeof window === 'undefined') {
    return instance;
  }
  
  // For client-side, ensure tokens are initialized
  initializeTokens();
  
  return instance;
}

// Export instances as they were before
export const axiosAuthInstance = createApiProxy();
export const axiosPublicInstance = createApiProxy();