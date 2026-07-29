import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const models = await ai.models.list();

  for await (const _model of models) {
    // No output
  }
}

main();