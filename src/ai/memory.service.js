import prisma from "../prisma/prisma.js";
export const getConversationMessages = async (conversationId) => {
    return prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
export const saveMessage = async (conversationId, role, content) => {
    return prisma.message.create({
        data: {
            conversationId,
            role,
            content,
        },
    });
};
//# sourceMappingURL=memory.service.js.map