import prisma from "../prisma/prisma.js";
export const createConversation = async (data) => {
    return await prisma.conversation.create({
        data: {
            title: data.title,
            userId: data.userId,
        },
    });
};
export const getConversations = async (userId) => {
    return await prisma.conversation.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const getConversationById = async (conversationId, userId) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return conversation;
};
export const deleteConversation = async (conversationId, userId) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    await prisma.conversation.delete({
        where: {
            id: conversationId,
        },
    });
    return {
        message: "Conversation deleted successfully",
    };
};
export const updateConversation = async (conversationId, userId, title) => {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return await prisma.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            title,
        },
    });
};
//# sourceMappingURL=conversation.service.js.map