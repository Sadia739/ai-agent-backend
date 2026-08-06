import client from "./openai.js";
import { toolDeclarations } from "./tool-definitions.js";
import { executeTool } from "./tool-executor.js";
import {
  getLastUserMessage,
  shouldUseWebSearch,
} from "./web-search-detection.js";
import {
  formatWebSearchForLLM,
  formatWebSearchForStorage,
} from "../tools/format-web-search.js";
import type { WebSearchResult } from "../tools/web-search.tool.js";

import type {
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from "openai/resources/chat/completions";

export interface ExecutedTool {
  toolName: string;
  toolInput: string;
  toolOutput: string;
}

const MAX_TOOL_ROUNDS = 5;

const serializeToolResult = (result: unknown): string => {
  if (result === undefined) {
    return JSON.stringify({
      success: false,
      error: "Tool returned no data.",
    });
  }
  if (typeof result === "string") {
    return result;
  }
  return JSON.stringify(result);
};

const formatToolResultForLLM = (
  toolName: string,
  result: unknown
): string => {
  if (toolName === "webSearch") {
    return formatWebSearchForLLM(result as WebSearchResult);
  }
  return serializeToolResult(result);
};

const formatToolResultForStorage = (
  toolName: string,
  result: unknown
): string => {
  if (toolName === "webSearch") {
    return formatWebSearchForStorage(result as WebSearchResult);
  }
  return serializeToolResult(result);
};

const runToolCalls = async (
  toolCalls: NonNullable<
    import("openai/resources/chat/completions").ChatCompletionMessage["tool_calls"]
  >,
  messages: ChatCompletionMessageParam[],
  executedTools: ExecutedTool[],
  userId?: number
) => {
  for (const toolCall of toolCalls) {
    if (toolCall.type !== "function") continue;

    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(toolCall.function.arguments);
    } catch {
      args = {};
    }

    let result: unknown;
    try {
      result = await executeTool(
        toolCall.function.name,
        args,
        { userId }
      );
    } catch (error) {
      result = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Tool execution failed.",
      };
    }

    const llmContent = formatToolResultForLLM(
      toolCall.function.name,
      result
    );

    const storageContent = formatToolResultForStorage(
      toolCall.function.name,
      result
    );

    executedTools.push({
      toolName: toolCall.function.name,
      toolInput: JSON.stringify(args),
      toolOutput: storageContent,
    });

    const toolMessage: ChatCompletionToolMessageParam = {
      role: "tool",
      tool_call_id: toolCall.id,
      content: llmContent,
    };

    messages.push(toolMessage);
  }
};

async function* streamFinalResponse(
  messages: ChatCompletionMessageParam[],
  initialContent?: string | null
): AsyncGenerator<string, void, void> {
  if (initialContent) {
    yield initialContent;
    return;
  }

  const stream = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    stream: true,
  });

  let streamed = "";

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? "";

    if (token) {
      streamed += token;
      yield token;
    }
  }

  if (!streamed) {
    yield "No response generated.";
  }
}

export async function* generateWithToolsStream(
  messages: ChatCompletionMessageParam[],
  userId?: number
): AsyncGenerator<
  string,
  ExecutedTool[],
  void
> {
  const lastUserMessage = getLastUserMessage(messages);
  const forceWebSearch = shouldUseWebSearch(lastUserMessage);
  const executedTools: ExecutedTool[] = [];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      tools: toolDeclarations,
      tool_choice:
        round === 0 && forceWebSearch
          ? { type: "function", function: { name: "webSearch" } }
          : "auto",
    });

    let assistant = response.choices[0].message;

    if (
      round === 0 &&
      forceWebSearch &&
      (!assistant.tool_calls || assistant.tool_calls.length === 0)
    ) {
      const fallbackResponse =
        await client.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages,
          tools: toolDeclarations,
          tool_choice: {
            type: "function",
            function: { name: "webSearch" },
          },
        });

      assistant = fallbackResponse.choices[0].message;
    }

    if (!assistant.tool_calls || assistant.tool_calls.length === 0) {
      yield* streamFinalResponse(messages, assistant.content);
      return executedTools;
    }

    messages.push(assistant);

    await runToolCalls(
      assistant.tool_calls,
      messages,
      executedTools,
      userId
    );
  }

  yield "I couldn't complete that request. Please try again.";
  return executedTools;
}

export const generateWithTools = async (
  messages: ChatCompletionMessageParam[],
  userId?: number
): Promise<{
  reply: string;
  executedTools: ExecutedTool[];
}> => {
  const lastUserMessage = getLastUserMessage(messages);
  const forceWebSearch = shouldUseWebSearch(lastUserMessage);
  const executedTools: ExecutedTool[] = [];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      tools: toolDeclarations,
      tool_choice:
        round === 0 && forceWebSearch
          ? { type: "function", function: { name: "webSearch" } }
          : "auto",
    });

    let assistant = response.choices[0].message;

    if (
      round === 0 &&
      forceWebSearch &&
      (!assistant.tool_calls || assistant.tool_calls.length === 0)
    ) {
      const fallbackResponse =
        await client.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages,
          tools: toolDeclarations,
          tool_choice: {
            type: "function",
            function: { name: "webSearch" },
          },
        });

      assistant = fallbackResponse.choices[0].message;
    }

    if (!assistant.tool_calls || assistant.tool_calls.length === 0) {
      return {
        reply: assistant.content ?? "No response generated.",
        executedTools,
      };
    }

    messages.push(assistant);

    await runToolCalls(
      assistant.tool_calls,
      messages,
      executedTools,
      userId
    );
  }

  return {
    reply: "I couldn't complete that request. Please try again.",
    executedTools,
  };
};
