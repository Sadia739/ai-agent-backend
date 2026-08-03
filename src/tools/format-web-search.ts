import type { WebSearchResult } from "./web-search.tool.js";

const MAX_SNIPPET_LENGTH = 280;
const MAX_RESULTS_FOR_LLM = 3;

const cleanSnippet = (text: string): string => {
  return text
    .replace(/\[\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]+/g, " ")
    .trim()
    .slice(0, MAX_SNIPPET_LENGTH);
};

export const formatWebSearchForLLM = (
  result: WebSearchResult
): string => {
  if (!result.success) {
    return JSON.stringify({
      success: false,
      error: result.error ?? "Search failed.",
    });
  }

  const lines: string[] = [];

  if (result.answer) {
    lines.push(`Summary: ${result.answer}`);
  }

  const results = (result.results ?? []).slice(
    0,
    MAX_RESULTS_FOR_LLM
  );

  if (results.length > 0) {
    lines.push("Sources:");
    for (const item of results) {
      const snippet = cleanSnippet(item.content);
      lines.push(
        `- ${item.title} (${item.url})${snippet ? `: ${snippet}` : ""}`
      );
    }
  }

  return lines.join("\n");
};

export const formatWebSearchForStorage = (
  result: WebSearchResult
): string => {
  if (!result.success) {
    return JSON.stringify({
      success: false,
      query: result.query,
      error: result.error,
    });
  }

  return JSON.stringify({
    success: true,
    query: result.query,
    answer: result.answer,
    results: (result.results ?? [])
      .slice(0, MAX_RESULTS_FOR_LLM)
      .map((item) => ({
        title: item.title,
        url: item.url,
        content: cleanSnippet(item.content),
      })),
  });
};
