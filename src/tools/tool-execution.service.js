import prisma from "../prisma/prisma.js";
export const saveToolExecution = async (conversationId, messageId, toolName, toolInput, toolOutput) => {
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
export const getToolExecutions = async (conversationId) => {
    return prisma.toolExecution.findMany({
        where: {
            conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
//# sourceMappingURL=tool-execution.service.js.map