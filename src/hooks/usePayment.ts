import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CreatePaymentRequest,
  type CreatePaymentResponse,
  type WebhookPayload,
  type ApiResponse,
  paymentService,
} from '@/services/paymentService';

export function usePayment() {
  const queryClient = useQueryClient();

  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ['payments', 'me'],
    queryFn: async () => {
      const res = await paymentService.getMyPayments();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const createPaymentMutation = useMutation<
    ApiResponse<CreatePaymentResponse>,
    unknown,
    CreatePaymentRequest
  >({
    mutationFn: (data) => paymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'me'] });
    },
  });

  const cancelPaymentMutation = useMutation<
    ApiResponse<boolean>,
    unknown,
    { paymentId: string; cancellationReason: string }
  >({
    mutationFn: ({ paymentId, cancellationReason }) =>
      paymentService.cancelPayment(paymentId, cancellationReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'me'] });
    },
  });

  const webhookMutation = useMutation<ApiResponse<boolean>, unknown, WebhookPayload>({
    mutationFn: (payload) => paymentService.handlePaymentWebhook(payload),
  });

  const returnPaymentMutation = useMutation<
    ApiResponse<null>,
    unknown,
    { code?: string; id?: string; cancel?: boolean; status?: string; orderCode?: number }
  >({
    mutationFn: (params) => paymentService.getPaymentReturn(params),
  });

  const getPaymentById = async (paymentId: string) => {
    const res = await paymentService.getPaymentById(paymentId);
    return res.data;
  };

  const getPaymentByOrderCode = async (orderCode: number) => {
    const res = await paymentService.getPaymentByOrderCode(orderCode);
    return res.data;
  };

  return {
    payments,
    isPaymentsLoading,

    createPayment: createPaymentMutation.mutateAsync,
    cancelPayment: cancelPaymentMutation.mutateAsync,
    handleWebhook: webhookMutation.mutateAsync,
    handleReturn: returnPaymentMutation.mutateAsync,

    getPaymentById,
    getPaymentByOrderCode,
    refetchPayments,

    status: {
      create: createPaymentMutation.status,
      cancel: cancelPaymentMutation.status,
      webhook: webhookMutation.status,
      return: returnPaymentMutation.status,
    },
  };
}
