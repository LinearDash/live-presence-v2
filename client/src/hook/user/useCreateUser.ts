import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: { name: string; email: string }) => api.createUser(userData),
    // Let consumers handle notifications via callbacks
  })
}