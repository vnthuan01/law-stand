import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const useLawyers = () => {
  return useQuery({
    queryKey: ['lawyers'],
    queryFn: async () => {
      const response = await userService.getAllLawyers();
      return response.data.data;
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return response.data.data;
    },
  });
};
