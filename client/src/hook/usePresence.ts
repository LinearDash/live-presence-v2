import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import type { User } from '@/types/user';

interface UserOnlineEvent {
  userId: string;
  name: string;
  colour: string;
}

interface UserOfflineEvent {
  userId: string;
}

export const usePresence = () => {
  const queryClient = useQueryClient();
  const socket = getSocket();

  useEffect(() => {
    // Listen for user coming online
    socket.on('user:online', (data: UserOnlineEvent) => {
      console.log('👋 User online:', data);

      // Update all users query
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map(user =>
          user.id === data.userId
            ? { ...user, isActive: true }
            : user
        );
      });
    });

    // Listen for user going offline
    socket.on('user:offline', (data: UserOfflineEvent) => {
      console.log('👋 User offline:', data);

      // Update all users query
      queryClient.setQueryData(['users'], (oldData: User[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map(user =>
          user.id === data.userId
            ? { ...user, isActive: false }
            : user
        );
      });
    });

    // Cleanup
    return () => {
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, [socket, queryClient]);
};