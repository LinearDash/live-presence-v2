import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.getConversations();
      // Extract conversations from the response structure
      return response.conversations || [];
    },
  });
};
