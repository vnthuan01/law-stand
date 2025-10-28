import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  planService,
  type Plan,
  type UpdatePlanPayload,
  type PlanFilterParams,
} from '@/services/planService';
import { toast } from 'sonner';

// Query Keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters: PlanFilterParams) => [...planKeys.lists(), filters] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  active: () => [...planKeys.all, 'active'] as const,
  userPlans: () => [...planKeys.all, 'userPlans'] as const,
  myPlans: () => [...planKeys.userPlans(), 'my'] as const,
  myActivePlans: () => [...planKeys.userPlans(), 'myActive'] as const,
  myCurrentPlan: () => [...planKeys.userPlans(), 'myCurrent'] as const,
};

// Public Plan Hooks
export const usePlans = (filters?: PlanFilterParams) => {
  return useQuery<Plan[], Error>({
    queryKey: planKeys.list(filters || {}),
    queryFn: async () => {
      if (filters) {
        const res = await planService.getPaged(filters);
        return res.plans; // chỉ trả về Plan[]
      } else {
        return planService.getAll(); // Plan[]
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivePlans = () => {
  return useQuery<Plan[], Error>({
    queryKey: planKeys.active(),
    queryFn: planService.getActive,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => planService.getById(id),
    enabled: !!id,
  });
};

export const usePlanByName = (name: string) => {
  return useQuery({
    queryKey: [...planKeys.details(), 'byName', name],
    queryFn: () => planService.getByName(name),
    enabled: !!name,
  });
};

export const usePlansByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: [...planKeys.lists(), 'byPrice', minPrice, maxPrice],
    queryFn: () => planService.getByPriceRange(minPrice, maxPrice),
    enabled: minPrice >= 0 && maxPrice > minPrice,
  });
};

export const usePlansByDuration = (days: number) => {
  return useQuery({
    queryKey: [...planKeys.lists(), 'byDuration', days],
    queryFn: () => planService.getByDuration(days),
    enabled: days > 0,
  });
};

// User Plan Hooks
export const useMyPlans = () => {
  return useQuery({
    queryKey: planKeys.myPlans(),
    queryFn: planService.getMyPlans,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMyActivePlans = () => {
  return useQuery({
    queryKey: planKeys.myActivePlans(),
    queryFn: planService.getMyActivePlans,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyCurrentPlan = () => {
  return useQuery({
    queryKey: planKeys.myCurrentPlan(),
    queryFn: planService.getMyCurrentPlan,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCanPurchase = (planId: string) => {
  return useQuery({
    queryKey: [...planKeys.userPlans(), 'canPurchase', planId],
    queryFn: () => planService.canPurchase(planId),
    enabled: !!planId,
  });
};

// Admin Hooks
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Plan created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create plan');
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      planService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(planKeys.detail(data.id), data);
      toast.success('Plan updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Plan deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    },
  });
};

export const useActivatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.activate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(planKeys.detail(data.id), data);
      toast.success('Plan activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate plan');
    },
  });
};

export const useDeactivatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.deactivate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.setQueryData(planKeys.detail(data.id), data);
      toast.success('Plan deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate plan');
    },
  });
};

export const useExpiredPlans = () => {
  return useQuery({
    queryKey: [...planKeys.userPlans(), 'expired'],
    queryFn: planService.getExpiredPlans,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeactivateExpired = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.deactivateExpired,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: planKeys.userPlans() });
      toast.success(`${data.deactivatedCount} expired plans deactivated`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate expired plans');
    },
  });
};

// Purchase Plan Hook
export const usePurchasePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planService.purchasePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.userPlans() });
      toast.success('Plan purchased successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to purchase plan');
    },
  });
};
