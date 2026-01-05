import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useMarkMessagesAsRead = () => {
  return useMutation({
    mutationFn: (conversationId: string) => api.markMessagesAsRead(conversationId),
  });
};
