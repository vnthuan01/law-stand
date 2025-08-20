import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import type { AxiosResponse } from 'axios';
import { authService } from '@/services/authService';
import type { LoginPayload, RegisterPayload, User } from '@/services/authService';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/lib/cookies';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  accessToken: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  const token = getAuthToken();

  // Fetch profile nếu có token
  const { data: profile, isLoading } = useQuery<User>({
    queryKey: ['users', 'profile'],
    queryFn: async () => {
      const res: AxiosResponse<User> = await authService.profile();
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile]);

  // Login
  const loginMutation = useMutation<AxiosResponse<LoginResponse>, unknown, LoginPayload>({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (res: AxiosResponse<LoginResponse>) => {
      const accessToken = res.data?.token;
      if (accessToken) {
        setAuthToken(accessToken);

        const userData: User = await queryClient.fetchQuery<User>({
          queryKey: ['users', 'profile'],
          queryFn: async () => {
            const profileRes: AxiosResponse<User> = await authService.profile();
            return profileRes.data;
          },
        });

        setUser(userData);
      }
    },
  });

  // Register
  const registerMutation = useMutation<AxiosResponse<RegisterResponse>, unknown, RegisterPayload>({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: async (res: AxiosResponse<RegisterResponse>) => {
      const accessToken = res.data?.accessToken;
      if (accessToken) {
        setAuthToken(accessToken);

        const userData: User = await queryClient.fetchQuery<User>({
          queryKey: ['users', 'profile'],
          queryFn: async () => {
            const profileRes: AxiosResponse<User> = await authService.profile();
            return profileRes.data;
          },
        });

        setUser(userData);
      }
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      clearAuthToken();
      setUser(null);
      queryClient.removeQueries({ queryKey: ['users', 'profile'] });
    },
  });

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
  };
}
