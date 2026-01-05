import { prisma } from '../config/db'

export const getOrCreateConversation = async(user1Id: string, user2Id: string) => {
    const [firstUserId, secondUserId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
try {
    let conversation = await prisma.conversation.findFirst({
        where:{
            AND: [
                { participants: { some: { id: firstUserId } } },
                { participants: { some: { id: secondUserId } } }
            ]
        },
        include: { participants: true }
    })

    if(!conversation){
        conversation = await prisma.conversation.create({
            data:{
                participants: {
                    connect: [
                        { id: firstUserId },
                        { id: secondUserId }
                    ]
                }
            },
            include: { participants: true }
        })
    }
    return conversation;
} catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    throw error;
}
}

export const getMessageHistory = async(conversationId: string, limit: number = 50, offset: number = 0) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
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
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        });

        return messages.reverse(); 
    } catch (error) {
        console.error('Error fetching message history:', error);
        throw error;
    }
}

export const getAllMessages = async(conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId
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
            },
            orderBy: { createdAt: 'asc' }
        });

        return messages;
    } catch (error) {
        console.error('Error fetching all messages:', error);
        throw error;
    }
}

export const markAsRead = async(conversationId: string, userId: string) => {
    try {
        const result = await prisma.message.updateMany({
            where: {
                conversationId,
                receiverId: userId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        return result;
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
}

