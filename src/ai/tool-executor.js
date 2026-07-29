import { toolFunctions } from "../tools/index.js";
export const executeTool = async (name, args) => {
    switch (name) {
        case "calculator":
            return toolFunctions.calculator(args.expression);
        case "getCurrentTime":
            return toolFunctions.getCurrentTime();
        case "getWeather":
            return await toolFunctions.getWeather(args.city);
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
};
//# sourceMappingURL=tool-executor.js.map