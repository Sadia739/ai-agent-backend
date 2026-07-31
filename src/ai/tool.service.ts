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

  // First AI call
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools: toolDeclarations,
    tool_choice: "auto",
  });

  console.log(
    "Full First Response:\n",
    JSON.stringify(response, null, 2)
  );

  const assistant = response.choices[0].message;

  console.log("Assistant Message:");
  console.log(JSON.stringify(assistant, null, 2));

  console.log("Tool Calls:");
  console.log(
    JSON.stringify(assistant.tool_calls, null, 2)
  );

  // No tool requested
  if (
    !assistant.tool_calls ||
    assistant.tool_calls.length === 0
  ) {
    console.log("No tool calls requested.");

    return {
      reply:
        assistant.content ??
        "No response generated.",
      executedTools: [],
    };
  }

  // Add assistant message
  messages.push(assistant);

  const executedTools: ExecutedTool[] = [];

  // Execute requested tools
  for (const toolCall of assistant.tool_calls) {
    if (toolCall.type !== "function") {
      continue;
    }

    console.log("--------------------------------");
    console.log(
      "Executing Tool:",
      toolCall.function.name
    );
    console.log(
      "Arguments String:",
      toolCall.function.arguments
    );

    let args: Record<string, any>;

    try {
      args = JSON.parse(
        toolCall.function.arguments
      );
    } catch (error) {
      console.error(
        "Failed to parse tool arguments:"
      );
      console.error(error);
      throw error;
    }

    console.log("Parsed Arguments:");
    console.log(args);

    const result = await executeTool(
      toolCall.function.name,
      args
    );

    console.log("Tool Result:");
    console.log(result);

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

  console.log("========== SECOND AI CALL ==========");

  console.log(
    "Messages Sent To Second Call:\n",
    JSON.stringify(messages, null, 2)
  );

  const finalResponse =
    await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: toolDeclarations,
    });

  console.log(
    "Final Response:\n",
    JSON.stringify(finalResponse, null, 2)
  );

  return {
    reply:
      finalResponse.choices[0].message.content ??
      "No response generated.",
    executedTools,
  };
};