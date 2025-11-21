import { useQuery } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users/getUsers`, {
    credentials: 'include', // Send cookies for authentication
  });
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json();
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })
}