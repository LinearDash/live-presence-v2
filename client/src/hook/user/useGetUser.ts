import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchUser = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
};

export const useGetUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
};