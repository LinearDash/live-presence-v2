import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.getConversations(),
  });
};
