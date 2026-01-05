import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { 
  getOrCreateConversation, 
  getMessageHistory as fetchMessageHistory,
  markAsRead as markMessagesAsRead 
} from '../services/messageService';

export const getConversations = async (req: Request, res: Response) => {
  try {
    // Get userId from authenticated request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    // Fetch all conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId
          }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            colour: true,
            email: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get last message only
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' } // Most recent first
    });

    // Format response with last message preview
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      participants: conv.participants.filter((p: any) => p.id !== userId), // Exclude current user
      lastMessage: conv.messages[0] || null,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));

    return res.status(200).json({
      message: 'Conversations fetched successfully',
      conversations: formattedConversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

const sendMessageSchema = z.object({
  receiverId: z.string().min(1, { message: 'Receiver ID is required' }),
  content: z.string().min(1, { message: 'Message content is required' }).max(5000),
  messageType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'GIF']).default('TEXT'),
  mediaUrl: z.string().url().optional().nullable()
});

export const sendMessage = async (req: Request, res: Response) => {
  try {
    // Get userId from authenticated request
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    // Validate request body
    const parsedData = sendMessageSchema.safeParse(req.body);

    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        details: formattedErrors
      });
    }

    const { receiverId, content, messageType, mediaUrl } = parsedData.data;

    // Validate receiver exists and is not the sender
    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(senderId, receiverId);

    if (!conversation) {
      return res.status(500).json({ message: 'Failed to create or get conversation' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        messageType,
        mediaUrl: mediaUrl || null,
        senderId,
        receiverId,
        conversationId: conversation.id,
        isDelivered: true,
        deliveredAt: new Date()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            colour: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            colour: true,
            email: true
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
};

export const getMessageHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { id: true }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some((p: any) => p.id === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    // Fetch message history
    const messages = await fetchMessageHistory(conversationId, limit, offset);

    return res.status(200).json({
      message: 'Message history fetched successfully',
      data: {
        conversationId,
        messages,
        pagination: {
          limit,
          offset,
          total: messages.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching message history:', error);
    return res.status(500).json({ message: 'Failed to fetch message history' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { id: true }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some((p: any) => p.id === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    // Mark messages as read
    const result = await markMessagesAsRead(conversationId, userId);

    return res.status(200).json({
      message: 'Messages marked as read successfully',
      data: {
        conversationId,
        updatedCount: result.count
      }
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};
