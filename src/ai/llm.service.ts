import ai from "./openai.js";

export const generateAIResponse = async (
  contents: any[]
) => {
  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-120b", // or the Groq model you're using
    messages: contents,
    temperature: 0.7,
  });

  return (
    response.choices[0]?.message?.content ??
    "No response generated."
  );
};