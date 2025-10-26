import { apiClient } from '@/lib/apiClients';

// ========== TYPES ==========

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  address: string;
  city: string;
  province: string;
  avatarUrl: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: number;
  roleDisplayName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ========== SERVICE METHODS ==========

export const userService = {
  // ===== USERS =====

  // GET /api/Users/{id} - Get user by ID
  getUserById: (userId: string) => apiClient.get<ApiResponse<User>>(`/Users/${userId}`),

  // GET /api/Users - Get all users
  getAllUsers: () => apiClient.get<ApiResponse<User[]>>('/Users'),

  // PUT /api/Users/{id} - Update user info
  updateUser: (userId: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/Users/${userId}`, data),

  // DELETE /api/Users/{id}
  deleteUser: (userId: string) => apiClient.delete<ApiResponse<User>>(`/Users/${userId}`),

  // ===== LAWYERS =====

  // GET /api/Lawyers/{id} - Get lawyer by ID
  getLawyerById: (lawyerId: string) => apiClient.get<ApiResponse<User>>(`/Lawyers/${lawyerId}`),

  // GET /api/Lawyers - Get all lawyers
  getAllLawyers: () => apiClient.get<ApiResponse<User[]>>('/Lawyers'),

  // PUT /api/Lawyers/{id} - Update lawyer info
  updateLawyer: (lawyerId: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/Lawyers/${lawyerId}`, data),

  // DELETE /api/Lawyers/{id}
  deleteLawyer: (lawyerId: string) => apiClient.delete<ApiResponse<User>>(`/Lawyers/${lawyerId}`),
};
