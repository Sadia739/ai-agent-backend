export const calculator = (expression: string): number | null => {
  try {
    const result = Function(
      `"use strict"; return (${expression})`
    )();

    return typeof result === "number" ? result : null;
  } catch {
    return null;
  }
};