import { Request, Response } from "express";
import { callGemini } from "../services/gemini.service";

// analyzeText: phân tích text trả về JSON
export const analyzeText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const prompt = `
      Analyze the following text and return ONLY the result in valid JSON (UTF-8, no comments, no extra text, no markdown):
      Text: "${text}"
      Format exactly like this:
      {
        "analysis": {
          "words": 6,
          "characters": 35,
          "sentiment": "positive"
        }
      }
    `;

    const result = await callGemini({ prompt });
    const cleaned = result.replace(/```json|```/g, "").trim();

    let jsonData;
    try {
      jsonData = JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini raw output:", cleaned);
      res.status(500).json({ error: "Gemini returned invalid JSON" });
      return;
    }

    res.json(jsonData);
  } catch (error: any) {
    console.error("Error in analyzeText:", error);
    res.status(500).json({ error: error.message });
  }
};

// rephraseText: viết lại câu trả về mảng câu viết lại
export const rephraseText = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const prompt = `
      Rephrase the following sentence in 3 different ways. Return ONLY a JSON array of strings, like:
      ["Rephrased sentence 1", "Rephrased sentence 2", "Rephrased sentence 3"]
      Sentence: "${text}"
    `;

    const result = await callGemini({ prompt });
    const cleaned = result.replace(/```json|```/g, "").trim();

    let rephrasedSentences: string[] = [];
    try {
      rephrasedSentences = JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini raw output:", cleaned);

      rephrasedSentences = [cleaned];
    }

    res.json({ rephrasedSentences });
  } catch (error: any) {
    console.error("Error in rephraseText:", error);
    res.status(500).json({ error: error.message });
  }
};

// checkGrammar: kiểm tra ngữ pháp trả về correctedText
export async function checkGrammar(req: Request, res: Response) {
  const { text } = req.body;
  try {
    const prompt = `Correct grammar in the following text. Return only the corrected sentence:\n"${text}"`;
    const correctedText = await callGemini({ prompt });
    res.json({ correctedText });
  } catch (error: any) {
    console.error("Error checking grammar:", error);
    res.status(500).json({ error: error.message });
  }
}

// checkSpelling: kiểm tra chính tả trả về correctedText
export async function checkSpelling(req: Request, res: Response) {
  const { text } = req.body;
  try {
    const prompt = `Correct spelling mistakes in the following text. Return only the corrected sentence:\n"${text}"`;
    const correctedText = await callGemini({ prompt });
    res.json({ correctedText });
  } catch (error: any) {
    console.error("Error checking spelling:", error);
    res.status(500).json({ error: error.message });
  }
}
