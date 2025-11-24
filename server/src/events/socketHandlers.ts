import { Server as SocketIOServer, Socket } from 'socket.io';
import { validateSession } from '../services/sessionService';
import { prisma } from '../config/db';
import cookie from 'cookie';

// Store active connections: socketId -> userId
const activeConnections = new Map<string, string>();

// Track socket count per user for multi-tab support
const userSocketCount = new Map<string, number>();

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', async (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Extract session token from cookie
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      console.log('No cookies found, disconnecting socket');
      socket.disconnect();
      return;
    }

    const parsedCookies = cookie.parse(cookies);
    const sessionToken = parsedCookies.session_token;

    if (!sessionToken) {
      console.log('No session token found, disconnecting socket');
      socket.disconnect();
      return;
    }

    // Validate session
    try {
      const session = await validateSession(sessionToken);

      if (!session || !session.users) {
        console.log('Invalid session, disconnecting socket');
        socket.disconnect();
        return;
      }

      const userId = session.users.id;

      // Store connection
      activeConnections.set(socket.id, userId);

      // Increment socket count for this user
      const currentCount = userSocketCount.get(userId) || 0;
      userSocketCount.set(userId, currentCount + 1);

      // If this is the first connection for this user, mark as active
      if (currentCount === 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isActive: true,
            lastActiveAt: new Date(),
          },
        });

        // Broadcast to all clients that user is online
        io.emit('user:online', {
          userId: userId,
          name: session.users.name,
          colour: session.users.colour,
        });

        console.log(`User ${userId} is now online (first connection)`);
      } else {
        console.log(`User ${userId} connected (${currentCount + 1} active connections)`);
      }

      // Send confirmation to the connected client
      socket.emit('authenticated', {
        userId: userId,
        message: 'Successfully authenticated',
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        await handleDisconnect(socket.id, io);
      });

      // Optional: Handle manual logout
      socket.on('logout', async () => {
        await handleDisconnect(socket.id, io);
        socket.disconnect();
      });

    } catch (error) {
      console.error('Authentication error:', error);
      socket.disconnect();
    }
  });
};

// Handle socket disconnect
async function handleDisconnect(socketId: string, io: SocketIOServer) {
  const userId = activeConnections.get(socketId);

  if (!userId) {
    console.log(`Socket ${socketId} disconnected (no user associated)`);
    return;
  }

  // Remove this socket from active connections
  activeConnections.delete(socketId);

  // Decrement socket count for this user
  const currentCount = userSocketCount.get(userId) || 0;
  const newCount = Math.max(0, currentCount - 1);

  if (newCount === 0) {
    // No more connections for this user, mark as inactive
    userSocketCount.delete(userId);

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          lastActiveAt: new Date(),
        },
      });

      // Broadcast to all clients that user is offline
      io.emit('user:offline', {
        userId: userId,
      });

      console.log(`User ${userId} is now offline (all connections closed)`);
    } catch (error) {
      console.error('Error updating user status on disconnect:', error);
    }
  } else {
    // User still has other connections open
    userSocketCount.set(userId, newCount);
    console.log(`User ${userId} disconnected (${newCount} connections remaining)`);
  }
}

// Helper function to get active users (useful for debugging)
export function getActiveUsers() {
  return Array.from(userSocketCount.keys());
}

// Helper function to get connection count for a user
export function getUserConnectionCount(userId: string): number {
  return userSocketCount.get(userId) || 0;
}