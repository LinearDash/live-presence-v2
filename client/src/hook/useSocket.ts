import { useEffect, useState } from "react"
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
let socket: Socket | null = null;

export const useSocket = (userId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
      setIsConnected(true);

      // Tell server this user is online
      socket?.emit('user:online', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId])

  return { socket, isConnected }
}