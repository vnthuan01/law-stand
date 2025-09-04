import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  appointmentService,
  type GetAppointmentsParams,
  type GetMonthAppointmentsParams,
} from '@/services/appointmentService';

export function useAppointmentsByDate(params: GetAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', 'byDate', params],
    queryFn: () => appointmentService.getAppointmentsByDate(params),
    staleTime: 60_000,
  });
}

export function useAppointmentsByMonth(params: GetMonthAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', 'byMonth', params],
    queryFn: () => appointmentService.getAppointmentsByMonth(params),
    staleTime: 60_000,
  });
}

export function useAppointmentActions() {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: (id: string) => appointmentService.approveAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const cancel = useMutation({
    mutationFn: (payload: { id: string; reason: string }) =>
      appointmentService.cancelAppointment(payload.id, payload.reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const reschedule = useMutation({
    mutationFn: (payload: { id: string; startsAtISO: string; reason: string }) =>
      appointmentService.rescheduleAppointment(payload.id, payload.startsAtISO, payload.reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return { approve, cancel, reschedule };
}
