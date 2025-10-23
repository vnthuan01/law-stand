import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import {
  appointmentService,
  type CreateAppointmentPayload,
  type UpdateAppointmentStatusPayload,
  type MyAppointment,
  type AppointmentDetail,
} from '@/services/appointmentService';
import type { AuthResponse } from '@/services/authService';

// ========== QUERIES ==========

/**
 * Hook lấy danh sách appointments của user hiện tại
 */
export function useMyAppointments() {
  return useQuery<MyAppointment[]>({
    queryKey: ['appointments', 'my'],
    queryFn: async () => {
      const res: AxiosResponse<AuthResponse<MyAppointment[]>> =
        await appointmentService.getMyAppointments();
      return res.data.data;
    },
    staleTime: 30_000,
  });
}

/**
 * Hook lấy danh sách appointments của một luật sư cụ thể
 */
export function useAppointmentsByLawyer(lawyerId: string) {
  return useQuery<MyAppointment[]>({
    queryKey: ['appointments', 'lawyer', lawyerId],
    queryFn: async () => {
      const res: AxiosResponse<AuthResponse<MyAppointment[]>> =
        await appointmentService.getByLawyer(lawyerId);
      return res.data.data;
    },
    enabled: !!lawyerId,
    staleTime: 30_000,
  });
}

/**
 * Hook lấy chi tiết một appointment theo ID
 */
export function useAppointmentDetail(appointmentId: string) {
  return useQuery<AppointmentDetail>({
    queryKey: ['appointments', 'detail', appointmentId],
    queryFn: async () => {
      const res: AxiosResponse<AuthResponse<AppointmentDetail>> =
        await appointmentService.getById(appointmentId);
      return res.data.data;
    },
    enabled: !!appointmentId,
    staleTime: 30_000,
  });
}

// ========== MUTATIONS ==========

/**
 * Hook tạo appointment mới
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<AuthResponse<AppointmentDetail>>,
    unknown,
    CreateAppointmentPayload
  >({
    mutationFn: (data: CreateAppointmentPayload) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

/**
 * Hook cập nhật trạng thái appointment
 */
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<AuthResponse<AppointmentDetail>>,
    unknown,
    { appointmentId: string; data: UpdateAppointmentStatusPayload }
  >({
    mutationFn: ({ appointmentId, data }) => appointmentService.updateStatus(appointmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

/**
 * Hook hủy appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<AuthResponse<boolean>>, unknown, string>({
    mutationFn: (appointmentId: string) => appointmentService.cancel(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// ========== COMBINED HOOK ==========

/**
 * Hook tổng hợp tất cả actions appointments
 */
export function useAppointments() {
  const queryClient = useQueryClient();

  const create = useMutation<
    AxiosResponse<AuthResponse<AppointmentDetail>>,
    unknown,
    CreateAppointmentPayload
  >({
    mutationFn: (data) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const updateStatus = useMutation<
    AxiosResponse<AuthResponse<AppointmentDetail>>,
    unknown,
    { appointmentId: string; data: UpdateAppointmentStatusPayload }
  >({
    mutationFn: ({ appointmentId, data }) => appointmentService.updateStatus(appointmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const cancel = useMutation<AxiosResponse<AuthResponse<boolean>>, unknown, string>({
    mutationFn: (appointmentId) => appointmentService.cancel(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    create: create.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
    cancel: cancel.mutateAsync,
    createStatus: create.status,
    updateStatusStatus: updateStatus.status,
    cancelStatus: cancel.status,
  };
}
