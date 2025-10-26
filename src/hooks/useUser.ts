import {
  userService,
  type ApiResponse,
  type UpdateProfileRequest,
  type UserDetail,
  type UserResponse,
  type GetUsersParams,
  type CreateUserRequest,
} from '@/services/userService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

export function useUsers(params?: GetUsersParams) {
  return useQuery<ApiResponse<UserResponse>>({
    queryKey: ['users', params],
    queryFn: async () => {
      const res: AxiosResponse<ApiResponse<UserResponse>> = await userService.getUsers(params);
      return res.data;
    },
    staleTime: 60_000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiResponse<UserDetail>>, unknown, UpdateProfileRequest>({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUserManagement(params?: GetUsersParams) {
  return useQuery<ApiResponse<UserResponse>>({
    queryKey: ['admin-users', params],
    queryFn: async () => {
      const res: AxiosResponse<ApiResponse<UserResponse>> = await userService.getUsers(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

// export function useToggleUserStatus() {
//   const queryClient = useQueryClient();

//   return useMutation<
//     AxiosResponse<ApiResponse<UserDetail>>,
//     unknown,
//     { userId: string; isActive: boolean }
//   >({
//     mutationFn: ({ userId, isActive }) =>
//       userService.updateProfile({ userId, isActive } as unknown as UpdateProfileRequest),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// }

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<UserDetail>>,
    unknown,
    { userId: string; data: UpdateProfileRequest }
  >({
    mutationFn: ({ userId, data }) => userService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiResponse<void>>, unknown, string>({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiResponse<UserDetail>>, unknown, string>({
    mutationFn: (userId) => userService.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiResponse<UserDetail>>, unknown, string>({
    mutationFn: (userId) => userService.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useGetUserById(userId: string) {
  return useQuery<ApiResponse<UserDetail>>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res: AxiosResponse<ApiResponse<UserDetail>> = await userService.getUserById(userId);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ApiResponse<UserDetail>>, unknown, CreateUserRequest>({
    mutationFn: (data) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
