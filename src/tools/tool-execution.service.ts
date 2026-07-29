import prisma from "../prisma/prisma.js";

export const saveToolExecution = async (
  conversationId: number,
  messageId: number,
  toolName: string,
  toolInput: string,
  toolOutput: string
) => {
  return prisma.toolExecution.create({
    data: {
      conversationId,
      messageId,
      toolName,
      toolInput,
      toolOutput,
    },
  });
};

export const getToolExecutions = async (
  conversationId: number
) => {
  return prisma.toolExecution.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};