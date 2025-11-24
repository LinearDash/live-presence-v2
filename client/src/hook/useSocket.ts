import { useEffect, useState } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { useGetCurrentUser } from './user/useGetCurrentUser';


export const useSocket = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [isConnected, setIsConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    // Only connect if user is logged in
    if (!currentUser) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    // Connect socket
    socket.connect();

    // Setup event listeners
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('authenticated', (data) => {
      console.log('✅ Socket authenticated:', data);

    });


    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('authenticated');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [currentUser, socket]);

  return { socket, isConnected };
};