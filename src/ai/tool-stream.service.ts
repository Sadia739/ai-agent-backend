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

export async function* generateWithToolsStream(
  messages: ChatCompletionMessageParam[]
): AsyncGenerator<
  string,
  ExecutedTool[],
  void
> {
  const lastUserMessage = getLastUserMessage(messages);
  const forceWebSearch = shouldUseWebSearch(lastUserMessage);

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    tools: toolDeclarations,
    tool_choice: forceWebSearch
      ? { type: "function", function: { name: "webSearch" } }
      : "auto",
  });


  let assistant = response.choices[0].message;

  // Fallback: model skipped tools for a query that needs web search
  if (
    forceWebSearch &&
    (!assistant.tool_calls || assistant.tool_calls.length === 0)
  ) {

    const fallbackResponse =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        tools: toolDeclarations,
        tool_choice: {
          type: "function",
          function: { name: "webSearch" },
        },
      });

    assistant = fallbackResponse.choices[0].message;
  }

  if (
    !assistant.tool_calls ||
    assistant.tool_calls.length === 0
  ) {
    const stream =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        stream: true,
      });

    for await (const chunk of stream) {
      const token =
        chunk.choices[0]?.delta?.content ?? "";

      if (token) {
        yield token;
      }
    }

    return [];
  }

  messages.push(assistant);

  const executedTools: ExecutedTool[] = [];

  for (const toolCall of assistant.tool_calls) {
    if (toolCall.type !== "function") continue;

    const args = JSON.parse(toolCall.function.arguments);

    const result = await executeTool(
      toolCall.function.name,
      args
    );

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

  const stream =
    await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      stream: true,
    });

  for await (const chunk of stream) {
    const token =
      chunk.choices[0]?.delta?.content ?? "";

    if (token) {
      yield token;
    }
  }

  return executedTools;
}