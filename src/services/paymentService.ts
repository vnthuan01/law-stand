import { apiClient } from '@/lib/apiClients'; // hoặc "@/lib/axios" tùy cấu trúc project

export interface PaymentSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  lawyerName: string;
}

export interface PaymentAppointment {
  id: string;
  status: string;
  slot: PaymentSlot;
}

export interface Payment {
  id: string;
  appointmentId: string;
  orderCode: number;
  amount: number;
  description: string;
  checkoutUrl: string;
  qrCode: string;
  status: string;
  transactionCode: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  paidAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  appointment: PaymentAppointment;
}

export interface CreatePaymentRequest {
  appointmentId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  orderCode: number;
  amount: number;
  description: string;
  checkoutUrl: string;
  qrCode: string;
  status: string;
  createdAt: string;
}

export interface WebhookPayload {
  code: string;
  desc: string;
  success: boolean;
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId: string;
    counterAccountBankName: string;
    counterAccountName: string;
    counterAccountNumber: string;
    virtualAccountName: string;
    virtualAccountNumber: string;
  };
  signature: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const paymentService = {
  /**
   * POST /api/Payment/create
   * Tạo link thanh toán PayOS cho appointment
   */
  createPayment: async (body: CreatePaymentRequest) => {
    const res = await apiClient.post<ApiResponse<CreatePaymentResponse>>('/Payment/create', body);
    return res.data;
  },

  /**
   * POST /api/Payment/webhook
   * Nhận callback webhook từ PayOS
   */
  handlePaymentWebhook: async (payload: WebhookPayload) => {
    const res = await apiClient.post<ApiResponse<boolean>>('/Payment/webhook', payload);
    return res.data;
  },

  /**
   * GET /api/Payment/return
   * Dành cho redirect từ PayOS (xử lý kết quả thanh toán)
   */
  getPaymentReturn: async (params: {
    code?: string;
    id?: string;
    cancel?: boolean;
    status?: string;
    orderCode?: number;
  }) => {
    const res = await apiClient.get<ApiResponse<null>>('/Payment/return', { params });
    return res.data;
  },

  /**
   * GET /api/Payment/cancel
   * Dành cho redirect khi user hủy thanh toán
   */
  getPaymentCancel: async (orderCode: number) => {
    const res = await apiClient.get<ApiResponse<null>>('/Payment/cancel', {
      params: { orderCode },
    });
    return res.data;
  },

  /**
   * GET /api/Payment/{paymentId}
   * Lấy chi tiết payment theo ID
   */
  getPaymentById: async (paymentId: string) => {
    const res = await apiClient.get<ApiResponse<Payment>>(`/Payment/${paymentId}`);
    return res.data;
  },

  /**
   * GET /api/Payment/order/{orderCode}
   * Lấy payment theo mã order
   */
  getPaymentByOrderCode: async (orderCode: number) => {
    const res = await apiClient.get<ApiResponse<Payment>>(`/Payment/order/${orderCode}`);
    return res.data;
  },

  /**
   * GET /api/Payment/my-payments
   * Lấy danh sách payment của user hiện tại
   */
  getMyPayments: async () => {
    const res = await apiClient.get<ApiResponse<Payment[]>>('/Payment/my-payments');
    return res.data;
  },

  /**
   * POST /api/Payment/{paymentId}/cancel
   * Hủy payment link theo ID
   */
  cancelPayment: async (paymentId: string, cancellationReason: string) => {
    const res = await apiClient.post<ApiResponse<boolean>>(`/Payment/${paymentId}/cancel`, {
      cancellationReason,
    });
    return res.data;
  },
};
