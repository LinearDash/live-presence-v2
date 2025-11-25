import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

const getCurrentUser = async (): Promise<User> => {

  const response = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }
    throw new Error('Failed to fetch current user');
  }

  return response.json();
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  });
};