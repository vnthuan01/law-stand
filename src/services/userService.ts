import { apiClient } from '@/lib/apiClients';

export interface UserDetail {
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
  bio: string;
  postalCode: string;
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

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserResponse {
  data: UserDetail[];
  pagination: PaginationInfo;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number;
}

export interface GetUsersParams {
  role?: number;
  isActive?: boolean;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const userService = {
  // ===== ADMIN ENDPOINTS =====
  // updateUser: (userId: string, data: Partial<User>) =>
  //   apiClient.put<ApiResponse<User>>(`/Users/${userId}`, data),

  // deleteUser: (userId: string) => apiClient.delete<ApiResponse<User>>(`/Users/${userId}`),

  // getLawyerById: (lawyerId: string) => apiClient.get<ApiResponse<User>>(`/Lawyers/${lawyerId}`),

  // getAllLawyers: () => apiClient.get<ApiResponse<User[]>>('/Lawyers'),

  // updateLawyer: (lawyerId: string, data: Partial<User>) =>
  //   apiClient.put<ApiResponse<User>>(`/Lawyers/${lawyerId}`, data),

  // deleteLawyer: (lawyerId: string) => apiClient.delete<ApiResponse<User>>(`/Lawyers/${lawyerId}`),

  getUsers: (params?: GetUsersParams) => {
    const queryParams = new URLSearchParams();

    if (params?.role !== undefined) queryParams.append('Role', params.role.toString());
    if (params?.isActive !== undefined) queryParams.append('IsActive', params.isActive.toString());
    if (params?.searchTerm) queryParams.append('SearchTerm', params.searchTerm);
    if (params?.sortBy) queryParams.append('SortBy', params.sortBy);
    if (params?.sortDescending !== undefined)
      queryParams.append('SortDescending', params.sortDescending.toString());
    if (params?.pageNumber !== undefined)
      queryParams.append('PageNumber', params.pageNumber.toString());
    if (params?.pageSize !== undefined) queryParams.append('PageSize', params.pageSize.toString());

    const queryString = queryParams.toString();
    const url = `/Auth/users${queryString ? `?${queryString}` : ''}`;

    return apiClient.get<ApiResponse<UserResponse>>(url);
  },

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserDetail>>('/Auth/profile', data),

  updateUser: (userId: string, data: UpdateProfileRequest) =>
    apiClient.put<ApiResponse<UserDetail>>(`/Auth/users/${userId}`, data),

  deleteUser: (userId: string) => apiClient.delete<ApiResponse<void>>(`/Auth/users/${userId}`),

  activateUser: (userId: string) =>
    apiClient.put<ApiResponse<UserDetail>>(`/Auth/users/${userId}/activate`),

  deactivateUser: (userId: string) =>
    apiClient.delete<ApiResponse<UserDetail>>(`/Auth/users/${userId}`),

  getUserById: (userId: string) => apiClient.get<ApiResponse<UserDetail>>(`/Auth/users/${userId}`),

  createUser: (data: CreateUserRequest) =>
    apiClient.post<ApiResponse<UserDetail>>('/Auth/users', data),
};
