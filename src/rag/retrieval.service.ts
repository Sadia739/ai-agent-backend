import prisma from "../prisma/prisma.js";

const STOP_WORDS = new Set([
  "what",
  "is",
  "are",
  "the",
  "a",
  "an",
  "of",
  "to",
  "in",
  "on",
  "for",
  "and",
  "or",
  "with",
  "about",
  "can",
  "could",
  "would",
  "should",
  "you",
  "please",
  "explain",
  "tell",
  "me",
  "define",
  "describe",
  "term",
  "terms",
  "meaning",
  "give",
  "how",
  "why",
  "when",
  "where",
  "which",
  "cs304",
]);

function extractKeywords(question: string): string[] {
  return [
    ...new Set(
      question
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .map((word: string) => word.trim())
        .filter(
          (word: string) =>
            word.length > 2 &&
            !STOP_WORDS.has(word)
        )
    ),
  ];
}

export const retrieveDocumentContext = async (
  documentId: number,
  question: string
) => {
  const chunks =
    await prisma.documentChunk.findMany({
      where: {
        documentId,
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });

  const keywords = extractKeywords(question);

  const ranked = chunks
    .map((chunk: any) => {
      const text =
        chunk.content.toLowerCase();

      let score = 0;

      for (const keyword of keywords) {
        // Exact match
        if (text.includes(keyword)) {
          score += 10;
        }

        // Count occurrences
        const matches =
          text.match(
            new RegExp(keyword, "gi")
          );

        if (matches) {
          score += matches.length;
        }
      }

      return {
        ...chunk,
        score,
      };
    })
    .filter((chunk: any) => chunk.score > 0)
    .sort(
      (a: any, b: any) => b.score - a.score
    );

  if (ranked.length === 0) {
    return "";
  }

  return ranked
    .slice(0, 5)
    .map((chunk: any) => chunk.content)
    .join("\n\n");
};