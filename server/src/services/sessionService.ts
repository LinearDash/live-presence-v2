import { randomBytes } from 'crypto'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient();

export const createSession = async (userId: string) => {
  try {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await prisma.session.create({
      data: { userId, token, expiresAt }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    throw error; // Re-throw so controller can handle it
  }
};

export const validateSession = async (token: string) => {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        users: {
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

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error validating session:', error);
    return null; // Return null on error (invalid session)
  }
};

export const deleteSession = async (token: string) => {
  try {
    await prisma.session.delete({
      where: { token }
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    // Don't throw - logout should succeed even if session not found
  }
};