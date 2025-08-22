// services/lawService.ts
import { apiClient } from '@/lib/apiClients';

export interface AddServiceFormValues {
  name: string;
  description: string;
  standardPrice: number;
  relatedParties: string;
  isMainService: boolean;
  salePrice?: number;
}

export interface ServiceLaw {
  id: string;
  name: string;
  description: string;
  standardPrice: number;
  salePrice?: number;
  relatedParties: string;
  isMainService: boolean;
  createdAt: string;
  updatedAt: string;
}

// ------------------------
// API calls
// ------------------------
export const createService = async (data: AddServiceFormValues): Promise<ServiceLaw> => {
  const res = await apiClient.post<ServiceLaw>('/services', data);
  return res.data;
};

export const fetchServices = async (): Promise<ServiceLaw[]> => {
  const res = await apiClient.get<ServiceLaw[]>('/services');
  return res.data;
};

export const fetchServiceById = async (id: string): Promise<ServiceLaw> => {
  const res = await apiClient.get<ServiceLaw>(`/services/${id}`);
  return res.data;
};

export const updateService = async (
  id: string,
  data: Partial<AddServiceFormValues>,
): Promise<ServiceLaw> => {
  const res = await apiClient.put<ServiceLaw>(`/services/${id}`, data);
  return res.data;
};

export const deleteService = async (id: string): Promise<string> => {
  await apiClient.delete(`/services/${id}`);
  return id;
};
