import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import type { LoginPayload, RegisterPayload, User } from '@/services/authService';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/lib/cookies';

export function useAuth() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  const token = getAuthToken();

  // Fetch profile nếu có token
  const { data: profile, isLoading } = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => authService.profile().then((res) => res.data),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile]);

  // Login
  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (res) => {
      //Base on field name in response
      const accessToken = res.data?.token;
      if (accessToken) {
        setAuthToken(accessToken);

        const userData = await queryClient.fetchQuery({
          queryKey: ['users', 'profile'],
          queryFn: () => authService.profile().then((res) => res.data),
        });

        setUser(userData);
      }
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: async (res) => {
      const accessToken = res.data?.accessToken;
      if (accessToken) {
        setAuthToken(accessToken);

        const userData = await queryClient.fetchQuery({
          queryKey: ['users', 'profile'],
          queryFn: () => authService.profile().then((res) => res.data),
        });

        setUser(userData);
      }
    },
  });

  // Logout
  const logoutMutation = useMutation({
    // mutationFn: () => authService.logout(),
    mutationFn: async () => {
      clearAuthToken();
      setUser(null);
      queryClient.removeQueries({ queryKey: ['users', 'profile'] });
    },
    // onSuccess: () => {
    //   clearAuthToken();
    //   setUser(null);
    //   queryClient.removeQueries({ queryKey: ['users', 'profile'] });
    // },
  });

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isLoading,
    // expose mutateAsync so caller can await before navigation
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
  };
}
