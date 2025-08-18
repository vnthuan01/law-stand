import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState, useEffect} from "react";
import {authService} from "@/services/authService";
import type {LoginPayload, RegisterPayload, User} from "@/services/authService";
import {setAuthToken, clearAuthToken} from "@/lib/cookies";

export function useAuth() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  // Lấy profile user nếu đã có token trong cookie
  const {data: profile, isLoading} = useQuery({
    queryKey: ["users", "profile"],
    queryFn: () => authService.profile().then((res) => res.data),
    retry: false, // chưa login thì không retry
  });

  useEffect(() => {
    if (profile) setUser(profile);
  }, [profile]);

  // Login
  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (res, variables) => {
      if (res.data?.accessToken) {
        setAuthToken(res.data.accessToken, variables.rememberMe);
        await queryClient.invalidateQueries({queryKey: ["users", "profile"]});
      }
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: async (res) => {
      if (res.data?.accessToken) {
        setAuthToken(res.data.accessToken);
        await queryClient.invalidateQueries({queryKey: ["users", "profile"]});
      }
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuthToken();
      setUser(null);
      queryClient.removeQueries({queryKey: ["users", "profile"]});
    },
  });

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
  };
}
