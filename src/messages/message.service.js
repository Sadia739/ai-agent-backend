import prisma from "../prisma/prisma.js";
export const createMessage = async (data, userId) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: data.conversationId,
            userId,
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return await prisma.message.create({
        data: {
            conversationId: data.conversationId,
            role: data.role,
            content: data.content,
        },
    });
};
export const getMessagesByConversation = async (conversationId, userId) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return await prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
        include: {
            toolExecutions: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
};
export const getMessageById = async (messageId, userId) => {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
        include: {
            conversation: true,
        },
    });
    if (!message) {
        throw new Error("Message not found");
    }
    if (message.conversation.userId !== userId) {
        throw new Error("Unauthorized");
    }
    return message;
};
export const updateMessage = async (messageId, data, userId) => {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
        include: {
            conversation: true,
        },
    });
    if (!message) {
        throw new Error("Message not found");
    }
    if (message.conversation.userId !== userId) {
        throw new Error("Unauthorized");
    }
    return await prisma.message.update({
        where: {
            id: messageId,
        },
        data: {
            content: data.content,
        },
    });
};
export const deleteMessage = async (messageId, userId) => {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
        include: {
            conversation: true,
        },
    });
    if (!message) {
        throw new Error("Message not found");
    }
    if (message.conversation.userId !== userId) {
        throw new Error("Unauthorized");
    }
    await prisma.message.delete({
        where: {
            id: messageId,
        },
    });
    return {
        message: "Message deleted successfully",
    };
};
//# sourceMappingURL=message.service.js.map