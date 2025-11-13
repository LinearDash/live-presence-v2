import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../config/db'


export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('user:online', async () => {
      try {

      } catch (error) {

      }
    })
  });
};