import { apiClient } from '@/lib/apiClients';

// ========== TYPES ==========

export interface Lawyer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  address: string;
  city: string;
  province: string;
  avatarUrl: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: number;
  roleDisplayName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Slot {
  id: string;
  serviceId: string;
  lawyerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  lawyer?: Lawyer;
}

// ========== PAYLOADS ==========

export interface CreateSlotPayload {
  serviceId: string;
  lawyerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface UpdateSlotPayload {
  serviceId: string;
  lawyerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface AvailableSlotPayload {
  serviceId: string;
  lawyerId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSlotStatusPayload {
  status: string;
}

// ========== RESPONSE TYPES ==========

export interface SlotResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Slot | null;
}

export interface SlotListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Slot[];
}

// ========== SERVICE METHODS ==========

export const slotService = {
  // POST /api/Slots - Create slot
  create: (data: CreateSlotPayload) => apiClient.post<SlotResponse>('/Slots', data),

  // GET /api/Slots/{slotId} - Get slot by ID
  getById: (slotId: string) => apiClient.get<SlotResponse>(`/Slots/${slotId}`),

  // PUT /api/Slots/{slotId} - Update slot
  update: (slotId: string, data: UpdateSlotPayload) =>
    apiClient.put<SlotResponse>(`/Slots/${slotId}`, data),

  // DELETE /api/Slots/{slotId} - Delete slot
  delete: (slotId: string) => apiClient.delete<SlotResponse>(`/Slots/${slotId}`),

  // GET /api/Slots/lawyer/{lawyerId}?startDate=&endDate=
  getByLawyer: (lawyerId: string, startDate?: string, endDate?: string) =>
    apiClient.get<SlotListResponse>(`/Slots/lawyer/${lawyerId}`, {
      params: { startDate, endDate },
    }),

  // POST /api/Slots/available - Get available slots
  getAvailable: (data: AvailableSlotPayload) =>
    apiClient.post<SlotListResponse>('/Slots/available', data),

  // PATCH /api/Slots/{slotId}/status - Update status
  updateStatus: (slotId: string, data: UpdateSlotStatusPayload) =>
    apiClient.patch<SlotResponse>(`/Slots/${slotId}/status`, data),
};
