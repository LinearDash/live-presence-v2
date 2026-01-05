import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data: { receiverId: string; content: string }) => api.sendMessage(data),
  });
};
