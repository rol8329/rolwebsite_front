// src/services/api/authApi.ts
import { axiosAuthInstance, axiosPublicInstance } from './client';
import { API_URL } from '../../config/constants';
import type { 
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdateProfileData
} from '../../types/auth-types';

const BASE_URL = `${API_URL}/api/account`;

export const authApi = {
  /**
   * User Registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/auth/register/`, data);
    return response.data;
  },

  /**
   * User Login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("Credentials:", credentials);
    const response = await axiosPublicInstance.post(`${BASE_URL}/auth/login/`, credentials);
    return response.data;
  },

  /**
   * User Logout
   */
  async logout(refreshToken: string): Promise<{ message: string }> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/auth/logout/`, {
      refresh: refreshToken
    });
    return response.data;
  },

  /**
   * Get User Profile
   */
  async getProfile(): Promise<User> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/profile/`);
    return response.data;
  },

  /**
   * Update User Profile
   */
  async updateProfile(data: UpdateProfileData): Promise<{ user: User; message: string }> {
    const response = await axiosAuthInstance.patch(`${BASE_URL}/profile/`, data);
    return response.data;
  },

  /**
   * Get User Permissions
   */
  async getPermissions(): Promise<{
    user_id: number;
    email: string;
    role: string;
    permissions_level: number;
    groups: string[];
    is_owner: boolean;
    is_creator: boolean;
    can_create_posts: boolean;
    can_manage_users: boolean;
  }> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/permissions/`);
    return response.data;
  },

  /**
   * Get Dashboard Data
   */
  async getDashboardData(): Promise<{
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
  }> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/dashboard/`);
    return response.data;
  },

  /**
   * Change Password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/change-password/`, data);
    return response.data;
  },

  /**
   * Forgot Password - Send reset email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/forgot-password/`, data);
    return response.data;
  },

  /**
   * Reset Password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/reset-password/`, data);
    return response.data;
  },

  /**
   * Cancel/Delete Account
   */
  async cancelAccount(password: string): Promise<{ message: string }> {
    const response = await axiosAuthInstance.delete(`${BASE_URL}/cancel-account/`, {
      data: { password }
    });
    return response.data;
  },

  /**
   * Refresh Access Token
   */
  async refreshToken(refreshToken: string): Promise<{ access: string; message: string }> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/auth/refresh/`, {
      refresh: refreshToken
    });
    return response.data;
  },

  /**
   * Verify Email (if email verification is implemented)
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/verify-email/`, {
      token
    });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await axiosPublicInstance.post(`${BASE_URL}/resend-verification/`, {
      email
    });
    return response.data;
  },

  // Admin-only endpoints (Owner role required)
  
  /**
   * List all users (Owner only)
   */
  async getUsers(): Promise<{ users: User[]; total_count: number }> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/admin/users/`);
    return response.data;
  },

  /**
   * Change user role (Owner only)
   */
  async changeUserRole(userId: number, role: 'reader' | 'creator' | 'owner'): Promise<{
    message: string;
    user: User;
  }> {
    const response = await axiosAuthInstance.post(`${BASE_URL}/admin/change-role/`, {
      user_id: userId,
      role
    });
    return response.data;
  },

  /**
   * Get user by ID (Admin functionality)
   */
  async getUserById(userId: number): Promise<User> {
    const response = await axiosAuthInstance.get(`${BASE_URL}/admin/users/${userId}/`);
    return response.data;
  },

  /**
   * Deactivate user account (Owner only)
   */
  async deactivateUser(userId: number): Promise<{ message: string }> {
    const response = await axiosAuthInstance.patch(`${BASE_URL}/admin/users/${userId}/deactivate/`);
    return response.data;
  },

  /**
   * Activate user account (Owner only)
   */
  async activateUser(userId: number): Promise<{ message: string }> {
    const response = await axiosAuthInstance.patch(`${BASE_URL}/admin/users/${userId}/activate/`);
    return response.data;
  },
};