import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { authService } from '@/services/authService';
import type {
  LoginPayload,
  RegisterPayload,
  User,
  AuthResponse,
  LoginResponseData,
} from '@/services/authService';
import { getAuthToken, setAuthToken, clearAuthToken, setRefreshToken } from '@/lib/cookies';

export function useAuth() {
  const queryClient = useQueryClient();
  const token = getAuthToken();

  // Fetch profile nếu có token
  const {
    data: profile,
    isLoading,
    isFetching,
    isSuccess,
  } = useQuery<User>({
    queryKey: ['users', 'profile'],
    queryFn: async () => {
      const res: AxiosResponse<AuthResponse<User>> = await authService.me();
      return res.data.data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Tính toán loading state
  // Loading = true khi:
  // 1. Có token nhưng chưa có data và đang loading/fetching
  // 2. Hoặc có token nhưng chưa success
  const isAuthLoading = !!token && (!profile || isLoading || isFetching || !isSuccess);

  // Login
  const loginMutation = useMutation<
    AxiosResponse<AuthResponse<LoginResponseData>>,
    unknown,
    LoginPayload
  >({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (res: AxiosResponse<AuthResponse<LoginResponseData>>) => {
      const { accessToken, refreshToken } = res.data.data;

      if (accessToken) {
        setAuthToken(accessToken);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }

        // Fetch user profile và set vào cache
        await queryClient.fetchQuery<User>({
          queryKey: ['users', 'profile'],
          queryFn: async () => {
            const profileRes: AxiosResponse<AuthResponse<User>> = await authService.me();
            return profileRes.data.data;
          },
        });
      }
    },
  });

  // Register
  const registerMutation = useMutation<
    AxiosResponse<AuthResponse<string>>,
    unknown,
    RegisterPayload
  >({
    mutationFn: (data: RegisterPayload) => authService.register(data),
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // await authService.logout();
      clearAuthToken();
      queryClient.removeQueries({ queryKey: ['users', 'profile'] });
    },
  });

  return {
    user: profile || null,
    role: profile?.role || null,
    isAuthenticated: !!profile && !!token,
    isLoading: isAuthLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
  };
}
