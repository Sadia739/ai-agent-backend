import { ChatCompletionTool } from "openai/resources/chat/completions";

export const toolDeclarations: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculator",
      description:
        "Evaluate arithmetic expressions when the user asks for calculations.",
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
      description:
        "Get the current date and time when the user asks for time or date.",
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
      description:
        "Get the current weather for a specific city.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description:
              "City name for weather information",
          },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "webSearch",
      description:
        "Search the internet for latest news, current events, recent information, and facts that may have changed recently.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query for current information",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
];