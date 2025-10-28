import { apiClient } from '@/lib/apiClients';
import type { User } from './authService';

// Plan Types
export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserPlan {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  user: User;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanPayload {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  price?: number;
  durationDays?: number;
  features?: string[];
  isPopular?: boolean;
}

export interface PurchasePlanPayload {
  planId: string;
  startDate: string;
  paymentMethod: string;
}

export interface PlanFilterParams {
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const planService = {
  // Public Plan Endpoints
  getAll: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/plans');
    return response.data.data;
  },

  getActive: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/plans/active');
    return response.data.data;
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await apiClient.get(`/plans/${id}`);
    return response.data;
  },

  getByName: async (name: string): Promise<Plan> => {
    const response = await apiClient.get(`/plans/by-name/${encodeURIComponent(name)}`);
    return response.data;
  },

  getByPriceRange: async (minPrice: number, maxPrice: number): Promise<Plan[]> => {
    const response = await apiClient.get('/plans/by-price', {
      params: { minPrice, maxPrice },
    });
    return response.data.data;
  },

  getByDuration: async (days: number): Promise<Plan[]> => {
    const response = await apiClient.get(`/plans/by-duration/${days}`);
    return response.data.data;
  },

  getPaged: async (
    params: PlanFilterParams,
  ): Promise<{ plans: Plan[]; total: number; page: number; pageSize: number }> => {
    const response = await apiClient.get('/plans/paged', { params });
    return response.data.data;
  },

  // User Plan Endpoints
  getMyPlans: async (): Promise<UserPlan[]> => {
    const response = await apiClient.get('/userplans/my-plans');
    return response.data.data;
  },

  getMyActivePlans: async (): Promise<UserPlan[]> => {
    const response = await apiClient.get('/userplans/my-active-plans');
    return response.data.data;
  },

  getMyCurrentPlan: async (): Promise<UserPlan | null> => {
    const response = await apiClient.get('/userplans/my-current-plan');
    return response.data;
  },

  purchasePlan: async (payload: PurchasePlanPayload): Promise<UserPlan> => {
    const response = await apiClient.post('/userplans/purchase', payload);
    return response.data;
  },

  canPurchase: async (planId: string): Promise<{ canPurchase: boolean; reason?: string }> => {
    const response = await apiClient.get(`/userplans/can-purchase/${planId}`);
    return response.data;
  },

  // Admin Endpoints
  create: async (payload: CreatePlanPayload): Promise<Plan> => {
    const response = await apiClient.post('/plans', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdatePlanPayload): Promise<Plan> => {
    const response = await apiClient.put(`/plans/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  },

  activate: async (id: string): Promise<Plan> => {
    const response = await apiClient.patch(`/plans/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string): Promise<Plan> => {
    const response = await apiClient.patch(`/plans/${id}/deactivate`);
    return response.data;
  },

  getExpiredPlans: async (): Promise<UserPlan[]> => {
    const response = await apiClient.get('/userplans/expired');
    return response.data;
  },

  deactivateExpired: async (): Promise<{ deactivatedCount: number }> => {
    const response = await apiClient.post('/userplans/deactivate-expired');
    return response.data;
  },
};
