import ai from "./openai.js";
export const generateAIResponse = async (contents) => {
    const response = await ai.chat.completions.create({
        model: "llama-3.1-8b-instant", // or the Groq model you're using
        messages: contents,
        temperature: 0.7,
    });
    return (response.choices[0]?.message?.content ??
        "No response generated.");
};
//# sourceMappingURL=llm.service.js.map