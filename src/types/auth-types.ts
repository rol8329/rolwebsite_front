export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }

  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface APIResponse {
    access: string;
    refresh: string;
  }
  
  export interface AuthUser {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }
  
  export type Nullable<T> = T | null;
  
  export interface StorageServiceType {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
  }
  