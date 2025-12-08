import { OpenAI } from "openai";
import { adminDb } from "@/firebase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AIRiskScore = {
  overallScore: number; // 0–100
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  strengths: string[];
  concerns: string[];
  incidentPatterns: string[];
  paymentBehavior: string[];
  disputeBehavior: string[];
  aiSummary: string;
};

export async function computeReportRiskScore(renterId: string): Promise<AIRiskScore> {
  // 1. Load full timeline & behavior
  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const disputesSnap = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const paymentsSnap = await adminDb
    .collection("payments")
    .where("renterId", "==", renterId)
    .get();

  const incidents = incidentsSnap.docs.map((d) => d.data());
  const disputes = disputesSnap.docs.map((d) => d.data());
  const payments = paymentsSnap.docs.map((d) => d.data());

  // 2. Prepare AI prompt
  const prompt = `
Analyze this renter'''s full timeline and behaviors.

INCIDENTS:
${JSON.stringify(incidents, null, 2)}

DISPUTES:
${JSON.stringify(disputes, null, 2)}

PAYMENTS:
${JSON.stringify(payments, null, 2)}

Provide output as a structured JSON with:
{
  "overallScore": number (0–100),
  "riskLevel": "LOW" | "MODERATE" | "HIGH",
  "strengths": string[],
  "concerns": string[],
  "incidentPatterns": string[],
  "paymentBehavior": string[],
  "disputeBehavior": string[],
  "aiSummary": string
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: "You are an expert risk analyst for rental history." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(completion.choices[0].message.content);

  return data;
}
