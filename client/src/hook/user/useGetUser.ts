import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId!),
    enabled: !!userId,
  });
};