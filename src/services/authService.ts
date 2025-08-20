import type { UserRole } from '@/enums/UserRole';
import { apiClient } from '@/lib/apiClients';

export interface LoginPayload {
  us: string;
  pw: string;
  // rememberMe?: boolean;

}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  rememberMe: boolean;
}

export interface User {
  id: string;
  avatar?: string | null;
  email: string;
  name: string;
  address: string;
  phone: string;
  role: UserRole;
}

export const authService = {
  login: (data: LoginPayload) => apiClient.post('/auth/login', data),
  register: (data: RegisterPayload) => apiClient.post('/auth/register', data),
  profile: () => apiClient.get<User>('/auth/profile'),
  logout: () => apiClient.post('/auth/logout'),
};
