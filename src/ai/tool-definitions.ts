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
      name: "createCalendarEvent",
      description:
        "Schedule a new meeting or calendar event. Use when the user wants to create, add, or schedule a meeting, appointment, or event.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Event or meeting title",
          },
          description: {
            type: "string",
            description: "Optional event description or agenda",
          },
          location: {
            type: "string",
            description: "Optional meeting location or link",
          },
          startTime: {
            type: "string",
            description:
              "Start date and time in ISO 8601 format (e.g. 2026-08-05T10:00:00)",
          },
          endTime: {
            type: "string",
            description:
              "End date and time in ISO 8601 format (e.g. 2026-08-05T11:00:00)",
          },
        },
        required: ["title", "startTime", "endTime"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "listCalendarEvents",
      description:
        "View calendar events and meetings. Use when the user asks about their schedule, upcoming meetings, today's events, or this week's calendar.",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description:
              "Optional filter: show events starting from this date (ISO 8601)",
          },
          endDate: {
            type: "string",
            description:
              "Optional filter: show events ending before this date (ISO 8601)",
          },
        },
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "updateCalendarEvent",
      description:
        "Update an existing calendar event or meeting. Use when the user wants to reschedule, rename, or change event details.",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "number",
            description: "ID of the event to update",
          },
          title: {
            type: "string",
            description: "New event title",
          },
          description: {
            type: "string",
            description: "New event description",
          },
          location: {
            type: "string",
            description: "New event location",
          },
          startTime: {
            type: "string",
            description: "New start time in ISO 8601 format",
          },
          endTime: {
            type: "string",
            description: "New end time in ISO 8601 format",
          },
        },
        required: ["eventId"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "deleteCalendarEvent",
      description:
        "Delete or cancel a calendar event or meeting. Use when the user wants to remove an event from their calendar.",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "number",
            description: "ID of the event to delete",
          },
        },
        required: ["eventId"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "webSearch",
      description:
        "REQUIRED for latest news, current events, recent developments, and any facts that may have changed. Search the internet instead of answering from memory.",
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