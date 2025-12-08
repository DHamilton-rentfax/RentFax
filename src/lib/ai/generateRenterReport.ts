import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ReportRequest = {
  renter: any;
  timeline: any[];
  risk: any;
  scores: {
    identity: number | null;
    behavior: number | null;
    payment: number | null;
    confidence: number | null;
  };
};

export async function generateRenterReport(data: ReportRequest) {
  const prompt = `
You are RentFAX, an AI system that writes professional renter history reports similar to CARFAX.

NEVER invent information. ONLY summarize what is provided.

RENDER AS PURE JSON. NO EXTRA TEXT.

INPUT:
${JSON.stringify(data, null, 2)}

OUTPUT FORMAT:
{
  "executiveSummary": "...",
  "behaviorSummary": "...",
  "paymentSummary": "...",
  "identitySummary": "...",
  "riskSummary": "...",
  "flags": ["..."],
  "recommendations": ["..."]
}
`;

  let aiText = "";

  // -----------------------------
  // Recommended: Use OpenAI
  // -----------------------------
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    aiText = completion.choices[0].message.content ?? "";
  } catch (err) {
    console.error("OpenAI fail, falling back to Gemini:", err);

    // -----------------------------
    // Fallback: Gemini
    // -----------------------------
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.2 },
    });

    const res = await model.generateContent(prompt);
    aiText = res.response.text();
  }

  try {
    return JSON.parse(aiText);
  } catch {
    return {
      error: "AI output could not be parsed",
      raw: aiText,
    };
  }
}
