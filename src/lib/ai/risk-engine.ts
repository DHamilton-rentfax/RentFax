import OpenAI from "openai";
import { adminDb } from "@/firebase/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateRiskScore(renterId: string) {
  const renterRef = adminDb.collection("renters").doc(renterId);
  const renter = await renterRef.get();

  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const disputesSnap = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const incidents = incidentsSnap.docs.map((d) => d.data());
  const disputes = disputesSnap.docs.map((d) => d.data());

  const prompt = `
  You are the RentFAX Risk Engine.

  Renter Data:
  ${JSON.stringify(renter.data(), null, 2)}

  Incidents:
  ${JSON.stringify(incidents, null, 2)}

  Disputes:
  ${JSON.stringify(disputes, null, 2)}

  Based on patterns, severity, frequency, verification status, identity mismatch, unpaid balance, 
  and industry-level standards, calculate:

  1. A riskScore (0–100)
  2. A riskLevel: LOW / MEDIUM / HIGH / SEVERE
  3. A human-readable summary (2–4 sentences)
  4. Fraud signals: list of patterns or red flags

  Return JSON only:
  {
    "riskScore": number,
    "riskLevel": string,
    "summary": string,
    "signals": string[]
  }
  `;

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });

  const result = JSON.parse(response.output[0].content[0].text);

  await adminDb.collection("riskScores").doc(renterId).set(result, { merge: true });
  await renterRef.update({ riskScore: result.riskScore });

  return result;
}
