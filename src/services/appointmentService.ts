import { apiClient } from '@/lib/apiClients';
import type { AuthResponse } from './authService';

// ========== TYPES ==========

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

// User object trong appointment
export interface AppointmentUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  isActive: boolean;
  avatarUrl: string;
}

// Service object
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Lawyer object
export interface Lawyer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  avatarUrl: string;
}

// Slot object
export interface Slot {
  id: string;
  serviceId: string;
  lawyerId: string;
  date: string;
  startTime: string;
  endTime: string;
  service: Service;
  lawyer: Lawyer;
}

// Full appointment detail
export interface AppointmentDetail {
  id: string;
  userId: string;
  slotId: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  user: AppointmentUser;
  slot: Slot;
}

// My appointments list item (simplified)
export interface MyAppointment {
  id: string;
  status: AppointmentStatus;
  createdAt: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  servicePrice: number;
  lawyerName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

// ========== PAYLOADS ==========

export interface CreateAppointmentPayload {
  slotId: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
}

export interface AppointmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AppointmentDetail | null;
}
export interface MyAppointmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MyAppointment[];
}

// ========== SERVICE ==========

export const appointmentService = {
  // 1. Create appointment
  create: (data: CreateAppointmentPayload) =>
    apiClient.post<AuthResponse<AppointmentDetail>>('/Appointments', data),

  // 2. Get my appointments
  getMyAppointments: () =>
    apiClient.get<AuthResponse<MyAppointment[]>>('/Appointments/my-appointments'),

  // 3. Get appointments by lawyer
  getByLawyer: (lawyerId: string) =>
    apiClient.get<AuthResponse<MyAppointment[]>>(`/Appointments/lawyer/${lawyerId}`),

  // 4. Get appointment detail by ID
  getById: (appointmentId: string) =>
    apiClient.get<AuthResponse<AppointmentDetail>>(`/Appointments/${appointmentId}`),

  // 5. Update appointment status
  updateStatus: (appointmentId: string, data: UpdateAppointmentStatusPayload) =>
    apiClient.patch<AuthResponse<AppointmentDetail>>(`/Appointments/${appointmentId}/status`, data),

  // 6. Cancel appointment
  cancel: (appointmentId: string) =>
    apiClient.patch<AuthResponse<boolean>>(`/Appointments/${appointmentId}/cancel`),
};

// Export types for use in other files
export type { AppointmentDetail as Appointment };
