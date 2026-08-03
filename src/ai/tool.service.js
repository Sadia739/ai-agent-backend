import client from "./openai.js";
import { toolDeclarations } from "./tool-definitions.js";
import { executeTool } from "./tool-executor.js";
export const generateWithTools = async (messages) => {
    // First AI call
    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        tools: toolDeclarations,
        tool_choice: "auto",
    });
    const assistant = response.choices[0].message;
    // No tool was called
    if (!assistant.tool_calls ||
        assistant.tool_calls.length === 0) {
        return {
            reply: assistant.content ??
                "No response generated.",
            executedTools: [],
        };
    }
    // Add assistant message
    messages.push(assistant);
    const executedTools = [];
    // Execute every requested tool
    for (const toolCall of assistant.tool_calls) {
        if (toolCall.type !== "function") {
            continue;
        }
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeTool(toolCall.function.name, args);
        // Store tool execution in memory
        executedTools.push({
            toolName: toolCall.function.name,
            toolInput: JSON.stringify(args),
            toolOutput: JSON.stringify(result),
        });
        const toolMessage = {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
        };
        messages.push(toolMessage);
    }
    // Second AI call
    const finalResponse = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
    });
    return {
        reply: finalResponse.choices[0].message.content ??
            "No response generated.",
        executedTools,
    };
};
//# sourceMappingURL=tool.service.js.map