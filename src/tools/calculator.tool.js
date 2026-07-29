export const calculator = (expression) => {
    try {
        const result = Function(`"use strict"; return (${expression})`)();
        return typeof result === "number" ? result : null;
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=calculator.tool.js.map