import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import {
  serviceService,
  type CreateServicePayload,
  type UpdateServicePayload,
  type ServiceResponse,
  type Service,
} from '@/services/serviceService';

// ========== QUERIES ==========

/**
 * Hook lấy tất cả services
 */
export function useServices() {
  return useQuery<ServiceResponse<Service[]>>({
    queryKey: ['services'],
    queryFn: async () => {
      const res: AxiosResponse<ServiceResponse<Service[]>> = await serviceService.getAll();
      return res.data;
    },
    staleTime: 60_000, // Cache 1 phút
  });
}

/**
 * Hook lấy chi tiết một service theo ID
 */
export function useServiceDetail(serviceId: string) {
  return useQuery<ServiceResponse<Service>>({
    queryKey: ['services', 'detail', serviceId],
    queryFn: async () => {
      const res: AxiosResponse<ServiceResponse<Service>> = await serviceService.getById(serviceId);
      return res.data;
    },
    enabled: !!serviceId,
    staleTime: 60_000,
  });
}

// ========== MUTATIONS ==========

/**
 * Hook tạo service mới (Admin only)
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ServiceResponse<Service>>, unknown, CreateServicePayload>({
    mutationFn: (data: CreateServicePayload) => serviceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * Hook cập nhật service (Admin only)
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ServiceResponse<Service>>,
    unknown,
    { serviceId: string; data: UpdateServicePayload }
  >({
    mutationFn: ({ serviceId, data }) => serviceService.update(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * Hook xóa service (Admin only)
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<ServiceResponse<Service>>, unknown, string>({
    mutationFn: (serviceId: string) => serviceService.delete(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// ========== COMBINED HOOK ==========

/**
 * Hook tổng hợp tất cả service actions (dùng cho Admin)
 */
export function useServiceActions() {
  const queryClient = useQueryClient();

  const create = useMutation<
    AxiosResponse<ServiceResponse<Service>>,
    unknown,
    CreateServicePayload
  >({
    mutationFn: (data) => serviceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const update = useMutation<
    AxiosResponse<ServiceResponse<Service>>,
    unknown,
    { serviceId: string; data: UpdateServicePayload }
  >({
    mutationFn: ({ serviceId, data }) => serviceService.update(serviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const remove = useMutation<AxiosResponse<ServiceResponse<Service>>, unknown, string>({
    mutationFn: (serviceId) => serviceService.delete(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return {
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    createStatus: create.status,
    updateStatus: update.status,
    removeStatus: remove.status,
  };
}
