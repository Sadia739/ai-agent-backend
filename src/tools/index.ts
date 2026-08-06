import { calculator } from "./calculator.tool.js";
import { getCurrentTime } from "./time.tool.js";
import { getWeather } from "./weather.tool.js";
import { webSearch } from "./web-search.tool.js";
import {
  createCalendarEventTool,
  listCalendarEventsTool,
  updateCalendarEventTool,
  deleteCalendarEventTool,
} from "./calendar.tool.js";

export const toolFunctions = {
  calculator,
  getCurrentTime,
  getWeather,
  webSearch,
  createCalendarEvent: createCalendarEventTool,
  listCalendarEvents: listCalendarEventsTool,
  updateCalendarEvent: updateCalendarEventTool,
  deleteCalendarEvent: deleteCalendarEventTool,
};
