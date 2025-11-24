import { useState } from 'react';
import { api } from '../lib/api';
import { queryClient } from '@/lib/queryClient';
import { disconnectSocket } from '@/lib/socket';


export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.login({ email, password });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      await queryClient.invalidateQueries({ queryKey: ['currentUser'], refetchType: 'active' });

      await queryClient.refetchQueries({
        queryKey: ['currentUser']
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.register({ name, email, password });

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      await queryClient.invalidateQueries({ queryKey: ['currentUser'], refetchType: "active" });

      await queryClient.refetchQueries({
        queryKey: ['currentUser']
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      disconnectSocket();

      localStorage.removeItem('user');
      localStorage.removeItem('token');


      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      console.error('Logout error:', err);
    } finally {
      setLoading(false)
    }

  };

  return { login, register, logout, loading, error };
};