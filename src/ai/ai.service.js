import prisma from "../prisma/prisma.js";
import { SYSTEM_PROMPT } from "./prompts.js";
import { retrieveDocumentContext } from "../rag/retrieval.service.js";
import { buildDocumentPrompt } from "./prompt.service.js";
import client from "./openai.js";
import { generateWithTools } from "./tool.service.js";
import { saveToolExecution } from "../tools/tool-execution.service.js";
export const chatWithAI = async (data, userId) => {
    // Verify conversation ownership
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: data.conversationId,
            userId,
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    // Save user message
    await prisma.message.create({
        data: {
            conversationId: data.conversationId,
            role: "user",
            content: data.message,
        },
    });
    // Load conversation history
    const dbMessages = await prisma.message.findMany({
        where: {
            conversationId: data.conversationId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    // Convert to OpenAI format
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        ...dbMessages.map((message) => ({
            role: message.role === "user"
                ? "user"
                : "assistant",
            content: message.content,
        })),
    ];
    // Generate AI response + tool executions
    const result = await generateWithTools(messages);
    const reply = result.reply;
    // Save AI message
    const aiMessage = await prisma.message.create({
        data: {
            conversationId: data.conversationId,
            role: "model",
            content: reply,
        },
    });
    // Save tool executions linked to THIS AI message
    for (const tool of result.executedTools) {
        await saveToolExecution(data.conversationId, aiMessage.id, tool.toolName, tool.toolInput, tool.toolOutput);
    }
    return reply;
};
export const chatWithDocument = async (data, userId) => {
    // Verify ownership
    const document = await prisma.document.findFirst({
        where: {
            id: data.documentId,
            userId,
        },
    });
    if (!document) {
        throw new Error("Document not found");
    }
    // Retrieve RAG context
    const context = await retrieveDocumentContext(data.documentId, data.question);
    // Build prompt
    const prompt = buildDocumentPrompt(context, data.question);
    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You answer questions about uploaded documents.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    return (response.choices[0].message.content ??
        "No response generated.");
};
//# sourceMappingURL=ai.service.js.map