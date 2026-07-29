export const buildDocumentPrompt = (
  context: string,
  question: string
) => {
  return `
You are an AI assistant.

Answer the user's question using ONLY the information from the uploaded document.

Rules:

- Do not use outside knowledge.
- If the answer is not present in the document, reply:
  "I couldn't find that information in the uploaded document."
- Keep the answer clear and concise.

-------------------------
DOCUMENT
-------------------------

${context}

-------------------------
QUESTION
-------------------------

${question}

-------------------------
ANSWER
`;
};