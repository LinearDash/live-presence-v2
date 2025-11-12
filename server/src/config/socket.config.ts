import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }
  })
  return io;
}
