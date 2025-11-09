import { PrismaClient } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';


const prisma = new PrismaClient()

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
        colour: string | null;
        bio: string | null;
        urls: string[];
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.session_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            colour: true,
            bio: true,
            urls: true,
          }
        }
      }
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: session.id } });
      return res.status(401).json({ error: 'Session expired' });
    }

    req.user = session.user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}