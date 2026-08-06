import prisma from "../prisma/prisma.js";

import type {
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

import {
  ChatInput,
  DocumentChatInput,
} from "./ai.types.js";

import { SYSTEM_PROMPT } from "./prompts.js";
import { retrieveDocumentContext } from "../rag/retrieval.service.js";
import { buildDocumentPrompt } from "./prompt.service.js";

import client from "./openai.js";
import { generateWithTools } from "./tool.service.js";
import { generateWithToolsStream } from "./tool-stream.service.js";
import type { ExecutedTool } from "./tool-stream.service.js";

import { saveToolExecution } from "../tools/tool-execution.service.js";

// ======================================================
// Normal Chat (Existing)
// ======================================================

export const chatWithAI = async (
  data: ChatInput,
  userId: number
) => {
  // Verify conversation ownership
  const conversation =
    await prisma.conversation.findFirst({
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
  const dbMessages =
    await prisma.message.findMany({
      where: {
        conversationId: data.conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

 const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },

  ...dbMessages.map((message: any) => ({
    role:
      message.role === "user"
        ? "user"
        : "assistant",
    content: message.content,
  })),
] as ChatCompletionMessageParam[];

  // Tool Calling
  const result =
    await generateWithTools(messages, userId);

  const reply = result.reply;

  // Save AI message
  const aiMessage =
    await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: "model",
        content: reply,
      },
    });

  // Save Tool Executions
  for (const tool of result.executedTools) {
    await saveToolExecution(
      data.conversationId,
      aiMessage.id,
      tool.toolName,
      tool.toolInput,
      tool.toolOutput
    );
  }

  return reply;
};

// ======================================================
// Streaming Chat
// ======================================================

export async function* chatWithAIStream(
  data: ChatInput,
  userId: number
) {
  // Verify conversation ownership
  const conversation =
    await prisma.conversation.findFirst({
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
  const dbMessages =
    await prisma.message.findMany({
      where: {
        conversationId: data.conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },

    ...dbMessages.map(
      (message: any) =>
        ({
          role:
            message.role === "user"
              ? "user"
              : "assistant",
          content: message.content,
        }) as ChatCompletionMessageParam
    ),
  ];


  let fullResponse = "";

  const generator =
    generateWithToolsStream(messages, userId);

  let executedTools: ExecutedTool[] = [];

  while (true) {
    const { value, done } =
      await generator.next();

    if (done) {
      executedTools = value ?? [];
      break;
    }

    fullResponse += value;

    yield value;
  }

  const aiMessage =
    await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: "model",
        content: fullResponse,
      },
    });

  for (const tool of executedTools) {
    await saveToolExecution(
      data.conversationId,
      aiMessage.id,
      tool.toolName,
      tool.toolInput,
      tool.toolOutput
    );
  }
}

// ======================================================
// Document Chat
// ======================================================

export const chatWithDocument = async (
  data: DocumentChatInput,
  userId: number
) => {
  // Verify ownership
  const document =
    await prisma.document.findFirst({
      where: {
        id: data.documentId,
        userId,
      },
    });

  if (!document) {
    throw new Error("Document not found");
  }

  // Retrieve RAG context
  const context =
    await retrieveDocumentContext(
      data.documentId,
      data.question
    );

  // Build prompt
  const prompt =
    buildDocumentPrompt(
      context,
      data.question
    );

  const response =
    await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You answer questions about uploaded documents.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return (
    response.choices[0].message.content ??
    "No response generated."
  );
};