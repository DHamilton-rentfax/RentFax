// src/lib/aiRiskScore.ts

import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import OpenAI from "openai";

const app = getFirebaseAdminApp();
const db = getFirestore(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// -----------------------------------------------------------
// STORE / GET CACHED RISK SCORE
// -----------------------------------------------------------

export async function getCachedRiskScore(renterId: string) {
  const doc = await db.collection("riskCache").doc(renterId).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  // Ensure date fields are converted to Date objects
  if (data && data.lastUpdated && data.lastUpdated.toDate) {
    data.lastUpdated = data.lastUpdated.toDate();
  }
  return data;
}

export async function cacheRiskScore(renterId: string, data: any) {
  await db
    .collection("riskCache")
    .doc(renterId)
    .set(data, { merge: true });
}

// -----------------------------------------------------------
// GENERATE AI RISK SCORE (FULL NARRATIVE, CREDIT-BUREAU STYLE)
// -----------------------------------------------------------

export async function generateRiskScore(input: {
  fraudSignals: any[];
  publicProfile?: any;
  incidents?: any[];
  disputes?: any[];
}) {
  const systemPrompt = `
You are RentFAX, an enterprise-grade risk analysis engine for renter history.
You generate detailed risk assessments similar to a credit bureau or insurance underwriting system.

Provide:
- A numeric score (1–100)
- A risk level (LOW, MEDIUM, HIGH)
- A 3–6 sentence narrative analysis
  * Formal credit-bureau tone
  * Use public records, address history, fraud signals, and incident behavior
  * Justify risk clearly using evidence
  * Avoid emotion; be analytical and professional

Return ONLY valid JSON:
{
  "score": number,
  "level": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "string"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(input) },
    ],
    temperature: 0.2, // consistent reasoning
  });

  try {
    const content = response.choices[0].message.content;
    return JSON.parse(content!);
  } catch (err) {
    console.error("AI Risk Score parsing error:", err);

    // fallback to safe baseline
    return {
      score: 50,
      level: "MEDIUM",
      reasoning:
        "A system fallback risk score was generated due to incomplete or unavailable analytical input.",
    };
  }
}