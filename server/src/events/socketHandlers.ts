import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../config/db'


export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('user:online', async (userId: string) => {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isActive: true }
        })
        io.emit('user:status-changes', {
          userId,
          isActive: true
        })
        console.log((`User ${userId} is now online`));

      } catch (error) {
        console.error('Error updating user status:', error);
      }
    })

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
          })
          io.emit('user:status-changed', {
            userId,
            isActive: false,
          })
          console.log(`User ${userId} is now offline`);
        } catch (error) {
          console.error('Error updating user status:', error);
        }
      }
    })
  });
};