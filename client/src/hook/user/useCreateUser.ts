import { useMutation } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const createUser = async (userData: { name: string; email: string }) => {
  const res = await fetch(`${API_BASE_URL}/users/createUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return res.json();
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    // Let consumers handle notifications via callbacks
  })
}