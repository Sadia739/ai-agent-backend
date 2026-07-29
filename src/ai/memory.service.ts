import prisma from "../prisma/prisma.js";

export const getConversationMessages = async (
  conversationId: number
) => {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const saveMessage = async (
  conversationId: number,
  role: string,
  content: string
) => {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
};