import type { UserRole } from '@/enums/UserRole';
import { apiClient } from '@/lib/apiClients';

// Auth API Response wrapper
export interface AuthResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Login
export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

// Register
export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// User Profile
export interface User {
  id: string;
  avatar?: string | null;
  email: string;
  fullName: string;
  phoneNumber: string;
  address?: string;
  role: UserRole;
}

// Refresh Token
export interface RefreshTokenPayload {
  refreshToken: string;
}

export const authService = {
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse<LoginResponseData>>('/Auth/login', data),

  register: (data: RegisterPayload) => apiClient.post<AuthResponse<string>>('/Auth/register', data),

  me: () => apiClient.get<AuthResponse<User>>('/Auth/me'),

  refreshToken: (data: RefreshTokenPayload) =>
    apiClient.post<AuthResponse<LoginResponseData>>('/Auth/refresh-token', data),

  // logout: () => apiClient.post('/Auth/logout'),
};
