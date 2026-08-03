const EXCLUDED_PATTERNS = [
  /\b(weather|temperature|forecast|humidity|rain|snow)\b/i,
  /\b(what time|current time|what date|today'?s date)\b/i,
  /\b(calculate|compute|\d+\s*[\+\-\*\/]\s*\d+)\b/i,
];

const WEB_SEARCH_PATTERNS = [
  /\b(news|headlines|current events|breaking news|latest news)\b/i,
  /\b(latest|recent(ly)?|up-to-date|up to date|right now)\b/i,
  /\bwhat(?:'s| is) happening\b/i,
  /\btoday'?s?\s+\w+/i,
  /\bwho (?:is|won|are|was)\b/i,
  /\bstock price|market (?:today|now)\b/i,
  /\bsearch (?:the )?(?:web|internet|online)\b/i,
  /\bfind (?:out|me) (?:about|the latest)\b/i,
];

export const shouldUseWebSearch = (
  message: string
): boolean => {
  if (EXCLUDED_PATTERNS.some((p) => p.test(message))) {
    return false;
  }

  return WEB_SEARCH_PATTERNS.some((p) =>
    p.test(message)
  );
};

export const getLastUserMessage = (
  messages: { role: string; content?: unknown }[]
): string => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "user" && typeof msg.content === "string") {
      return msg.content;
    }
  }
  return "";
};
