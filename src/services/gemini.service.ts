import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function callGemini({
  prompt,
  maxTokens = 150,
  temperature = 0.5,
}: GeminiOptions): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
