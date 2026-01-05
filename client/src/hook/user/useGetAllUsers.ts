import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getAllUsers(),
  })
}