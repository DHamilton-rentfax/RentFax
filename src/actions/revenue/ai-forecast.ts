"use server";

import { db } from "@/lib/firebase/server";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { googleAI } from "@genkit-ai/googleai"; // already installed in your env

const model = googleAI("gemini-1.5-pro");

export async function getAIRevenueForecast() {
  // Fetch deals
  const dealsSnap = await getDocs(collection(db, "deals"));
  const deals = dealsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Fetch activities
  const actSnap = await getDocs(
    query(collection(db, "activities"), orderBy("timestamp", "desc"))
  );
  const activities = actSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Prepare input for AI model
  const prompt = `
  You are the AI Chief Revenue Officer for RentFAX.
  Analyze all deals, stages, amounts, reps, and activity patterns.

  Output these fields in JSON:
  {
    "aiMRRForecast": number,
    "confidenceScore": number (0-100),
    "dealRisks": [
      {
        "dealId": string,
        "risk": "high" | "medium" | "low",
        "slipProbability": number,
        "reason": string
      }
    ],
    "repPredictions": [
      {
        "repId": string,
        "expectedMRR": number,
        "performanceTrend": string
      }
    ],
    "summary": string
  }

  Deals:
  ${JSON.stringify(deals)}

  Activities:
  ${JSON.stringify(activities)}
  `;

  const result = await model.generateText(prompt);
  const text = result.text();
  
  try {
    return JSON.parse(text);
  } catch (err) {
    return {
      error: true,
      raw: text,
    };
  }
}
