// hooks/useLawService.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type AddServiceFormValues,
  type ServiceLaw,
  createService,
  fetchServices,
  fetchServiceById,
  updateService,
  deleteService,
} from '@/services/lawService';

export const useLawServiceById = (id: string) => {
  return useQuery({
    queryKey: ['lawService', id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
  });
};

export const useLawService = (id?: string) => {
  const queryClient = useQueryClient();

  const getLawServices = useQuery<ServiceLaw[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
    enabled: !id,
  });

  const addService = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const updateLawService = useMutation({
    mutationFn: (data: Partial<AddServiceFormValues>) => updateService(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['service', id] });
    },
  });

  const deleteLawService = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return {
    getLawServices,
    addService,
    updateLawService,
    deleteLawService,
  };
};
