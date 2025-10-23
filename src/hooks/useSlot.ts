import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import {
  slotService,
  type CreateSlotPayload,
  type UpdateSlotPayload,
  type AvailableSlotPayload,
  type UpdateSlotStatusPayload,
  type SlotResponse,
  type SlotListResponse,
} from '@/services/slotService';

// ========== QUERIES ==========

/**
 * Hook: Lấy danh sách slot theo lawyer
 */
export function useSlotsByLawyer(lawyerId: string, startDate?: string, endDate?: string) {
  return useQuery<SlotListResponse>({
    queryKey: ['slots', 'lawyer', lawyerId, startDate, endDate],
    queryFn: async () => {
      const res: AxiosResponse<SlotListResponse> = await slotService.getByLawyer(
        lawyerId,
        startDate,
        endDate,
      );
      return res.data;
    },
    enabled: !!lawyerId,
    staleTime: 60_000,
  });
}

/**
 * Hook: Lấy danh sách slot khả dụng (available)
 */
export function useAvailableSlots(payload: AvailableSlotPayload | null) {
  return useQuery<SlotListResponse>({
    queryKey: ['slots', 'available', payload],
    queryFn: async () => {
      if (!payload) throw new Error('Missing payload');
      const res: AxiosResponse<SlotListResponse> = await slotService.getAvailable(payload);
      return res.data;
    },
    enabled: !!payload,
    staleTime: 30_000,
  });
}

/**
 * Hook: Lấy chi tiết slot theo ID
 */
export function useSlotDetail(slotId: string) {
  return useQuery<SlotResponse>({
    queryKey: ['slots', 'detail', slotId],
    queryFn: async () => {
      const res: AxiosResponse<SlotResponse> = await slotService.getById(slotId);
      return res.data;
    },
    enabled: !!slotId,
    staleTime: 60_000,
  });
}

// ========== MUTATIONS ==========

/**
 * Hook: Tạo slot mới
 */
export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<SlotResponse>, unknown, CreateSlotPayload>({
    mutationFn: (data) => slotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}

/**
 * Hook: Cập nhật slot
 */
export function useUpdateSlot() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<SlotResponse>,
    unknown,
    { slotId: string; data: UpdateSlotPayload }
  >({
    mutationFn: ({ slotId, data }) => slotService.update(slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}

/**
 * Hook: Xóa slot
 */
export function useDeleteSlot() {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<SlotResponse>, unknown, string>({
    mutationFn: (slotId: string) => slotService.delete(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}

/**
 * Hook: Cập nhật trạng thái slot (PATCH /status)
 */
export function useUpdateSlotStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<SlotResponse>,
    unknown,
    { slotId: string; data: UpdateSlotStatusPayload }
  >({
    mutationFn: ({ slotId, data }) => slotService.updateStatus(slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });
}

// ========== COMBINED HOOK ==========

/**
 * Hook tổng hợp các hành động liên quan tới Slot
 */
export function useSlotActions() {
  const queryClient = useQueryClient();

  const create = useMutation<AxiosResponse<SlotResponse>, unknown, CreateSlotPayload>({
    mutationFn: (data) => slotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });

  const update = useMutation<
    AxiosResponse<SlotResponse>,
    unknown,
    { slotId: string; data: UpdateSlotPayload }
  >({
    mutationFn: ({ slotId, data }) => slotService.update(slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });

  const remove = useMutation<AxiosResponse<SlotResponse>, unknown, string>({
    mutationFn: (slotId) => slotService.delete(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });

  const updateStatus = useMutation<
    AxiosResponse<SlotResponse>,
    unknown,
    { slotId: string; data: UpdateSlotStatusPayload }
  >({
    mutationFn: ({ slotId, data }) => slotService.updateStatus(slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
  });

  return {
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
    createStatus: create.status,
    updateStatusState: update.status,
    removeStatus: remove.status,
    updateSlotStatusState: updateStatus.status,
  };
}
