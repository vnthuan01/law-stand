import { apiClient } from '@/lib/apiClients';

// ========== TYPES ==========

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
}

// ========== PAYLOADS ==========

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
}

export interface UpdateServicePayload {
  name: string;
  description: string;
  price: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ========== SERVICE ==========

export const serviceService = {
  // GET /api/Services - Get all services
  getAll: () => apiClient.get<ServiceResponse<Service[]>>('/Services'),

  // POST /api/Services - Create new service
  create: (data: CreateServicePayload) =>
    apiClient.post<ServiceResponse<Service>>('/Services', data),

  // GET /api/Services/{serviceId} - Get service by ID
  getById: (serviceId: string) => apiClient.get<ServiceResponse<Service>>(`/Services/${serviceId}`),

  // PUT /api/Services/{serviceId} - Update service
  update: (serviceId: string, data: UpdateServicePayload) =>
    apiClient.put<ServiceResponse<Service>>(`/Services/${serviceId}`, data),

  // DELETE /api/Services/{serviceId} - Delete service
  delete: (serviceId: string) =>
    apiClient.delete<ServiceResponse<Service>>(`/Services/${serviceId}`),
};
