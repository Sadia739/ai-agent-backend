import { toolFunctions } from "../tools/index.js";
import type {
  CreateCalendarEventArgs,
  ListCalendarEventsArgs,
  UpdateCalendarEventArgs,
  DeleteCalendarEventArgs,
} from "../tools/calendar.tool.js";

export interface ToolContext {
  userId?: number;
}

export const executeTool = async (
  name: string,
  args: Record<string, any>,
  context: ToolContext = {}
) => {
  switch (name) {
    case "calculator":
      return toolFunctions.calculator(args.expression);

    case "getCurrentTime":
      return toolFunctions.getCurrentTime();

    case "getWeather":
      return await toolFunctions.getWeather(args.city);

    case "webSearch":
      return await toolFunctions.webSearch(args.query);

    case "createCalendarEvent": {
      if (!context.userId) {
        throw new Error("User authentication required for calendar.");
      }
      return await toolFunctions.createCalendarEvent(
        context.userId,
        args as CreateCalendarEventArgs
      );
    }

    case "listCalendarEvents": {
      if (!context.userId) {
        throw new Error("User authentication required for calendar.");
      }
      return await toolFunctions.listCalendarEvents(
        context.userId,
        args as ListCalendarEventsArgs
      );
    }

    case "updateCalendarEvent": {
      if (!context.userId) {
        throw new Error("User authentication required for calendar.");
      }
      return await toolFunctions.updateCalendarEvent(
        context.userId,
        args as UpdateCalendarEventArgs
      );
    }

    case "deleteCalendarEvent": {
      if (!context.userId) {
        throw new Error("User authentication required for calendar.");
      }
      return await toolFunctions.deleteCalendarEvent(
        context.userId,
        args as DeleteCalendarEventArgs
      );
    }

    case "generateImage": {
      const prompt = args.prompt as string;
      const size = (args.size as string) || undefined;
      const n = typeof args.n === "number" ? args.n : 1;
      return await toolFunctions.generateImage(prompt, size, n);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};
