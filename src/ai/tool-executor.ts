import { toolFunctions } from "../tools/index.js";

export const executeTool = async (
  name: string,
  args: Record<string, any>
) => {
  console.log("==================================");
  console.log("EXECUTE TOOL");
  console.log("Tool:", name);
  console.log("Arguments:", args);
  console.log("==================================");

  switch (name) {
    case "calculator":
      return toolFunctions.calculator(
        args.expression
      );

    case "getCurrentTime":
      return toolFunctions.getCurrentTime();

    case "getWeather":
      return await toolFunctions.getWeather(
        args.city
      );

    case "webSearch":
      return await toolFunctions.webSearch(
        args.query
      );

    default:
      throw new Error(
        `Unknown tool: ${name}`
      );
  }
};