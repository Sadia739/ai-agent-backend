import { ChatCompletionTool } from "openai/resources/chat/completions";

export const toolDeclarations: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculator",
      description: "Evaluate arithmetic expressions.",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Arithmetic expression",
          },
        },
        required: ["expression"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "getCurrentTime",
      description: "Get the current date and time.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Get the current weather for a city.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name",
          },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },
];