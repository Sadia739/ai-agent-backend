import client from "./openai.js";
import { toolDeclarations } from "./tool-definitions.js";
import { executeTool } from "./tool-executor.js";

import type {
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from "openai/resources/chat/completions";

export interface ExecutedTool {
  toolName: string;
  toolInput: string;
  toolOutput: string;
}

export const generateWithTools = async (
  messages: ChatCompletionMessageParam[]
): Promise<{
  reply: string;
  executedTools: ExecutedTool[];
}> => {
  console.log("========== FIRST AI CALL ==========");

  // First AI call (tool selection)
  const response =
    await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      tools: toolDeclarations,
      tool_choice: "auto",
    });

  console.log(
    JSON.stringify(response, null, 2)
  );

  const assistant =
    response.choices[0].message;

  // No tool requested
  if (
    !assistant.tool_calls ||
    assistant.tool_calls.length === 0
  ) {
    return {
      reply:
        assistant.content ??
        "No response generated.",
      executedTools: [],
    };
  }

  // Add assistant tool-call message
  messages.push(assistant);

  const executedTools: ExecutedTool[] = [];

  // Execute every tool
  for (const toolCall of assistant.tool_calls) {
    if (toolCall.type !== "function") continue;

    const args = JSON.parse(
      toolCall.function.arguments
    );

    console.log(
      "Executing:",
      toolCall.function.name,
      args
    );

    const result = await executeTool(
      toolCall.function.name,
      args
    );

    console.log("Tool Result:", result);

    executedTools.push({
      toolName: toolCall.function.name,
      toolInput: JSON.stringify(args),
      toolOutput: JSON.stringify(result),
    });

    const toolMessage: ChatCompletionToolMessageParam =
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      };

    messages.push(toolMessage);
  }

  console.log(
    "========== SECOND AI CALL =========="
  );

  console.log(
    JSON.stringify(messages, null, 2)
  );

  // IMPORTANT:
  // Do NOT send tools again.
  const finalResponse =
    await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

  console.log(
    JSON.stringify(finalResponse, null, 2)
  );

  return {
    reply:
      finalResponse.choices[0].message
        .content ??
      "No response generated.",
    executedTools,
  };
};