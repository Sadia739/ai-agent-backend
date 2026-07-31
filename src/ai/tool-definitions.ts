import { ChatCompletionTool } from "openai/resources/chat/completions";

export const toolDeclarations: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculator",
      description:
        "Evaluate arithmetic expressions like 2+2, 5*8, (10/2)+3. Use this tool whenever the user asks to calculate something.",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Arithmetic expression",
          },
        },
        required: ["expression"],
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
      },
    },
  },

  // {
  //   type: "function",
  //   function: {
  //     name: "webSearch",
  //     description:
  //       "Search the internet for current information, latest news, facts, recent events, or anything requiring up-to-date information.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         query: {
  //           type: "string",
  //           description: "Search query",
  //         },
  //       },
  //       required: ["query"],
  //     },
  //   },
  // },
];