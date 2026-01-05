import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useGetMessageHistory = (conversationId: string | null, limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ['messages', conversationId, limit, offset],
    queryFn: async () => {
      const response = await api.getMessageHistory(conversationId!, limit, offset);
      // Extract messages from the response data structure
      return response.data?.messages || [];
    },
    enabled: !!conversationId,
  });
};
