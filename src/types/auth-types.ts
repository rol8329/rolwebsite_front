// src/types/auth-types.ts

export type Nullable<T> = T | null;

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'reader' | 'creator' | 'owner';
  permissions_level: number;
  created_at: string;
  is_active?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
  message: string;
}

export interface APIResponse {
  access: string;
  refresh: string;
  user?: User;
  message?: string;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  username?: string;
  first_name?: string;
  last_name?: string;
  // Note: email is typically read-only
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface AuthState {
  user: Nullable<User>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Nullable<string>;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  cancelAccount: (password: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

export interface PermissionsResponse {
  user_id: number;
  email: string;
  role: string;
  permissions_level: number;
  groups: string[];
  is_owner: boolean;
  is_creator: boolean;
  can_create_posts: boolean;
  can_manage_users: boolean;
}

export interface DashboardData {
  user: User;
  welcome_message: string;
  can_create?: boolean;
  total_users?: number;
  user_roles?: {
    readers: number;
    creators: number;
    owners: number;
  };
  recent_users?: User[];
  created_posts_count?: number;
  message?: string;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Error handling types
export interface APIErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ValidationErrors {
  [key: string]: string[];
}