import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
// Assuming you will create this utility. For now, let's mock it.
// import { generateModel } from "@/utils/ai"; 

// Mock function for generateModel
async function generateModel(prompt: string): Promise<string> {
    console.log("AI Model Prompt (mocked):", prompt);
    // This mock returns a static JSON string. In a real scenario, this would
    // be a dynamic response from a generative AI model.
    return JSON.stringify({
        "overallScore": 74,
        "confidence": 0.82,
        "categories": {
            "paymentHistory": 68,
            "propertyCondition": 82,
            "communication": 75,
            "fraudRisk": 40,
            "behavior": 88
        }
    });
}


export async function POST(req: Request) {
  const { renterId } = await req.json();

  const out = await generateModel(`
    Analyze renter ${renterId} and output:
    - overall score 0–100
    - confidence 0–1
    - categories: paymentHistory, behavior, communication, fraudRisk, propertyCondition
    Use JSON only.
  `);

  const parsed = JSON.parse(out);

  await adminDb.collection("aiRiskScores").doc(renterId).set(parsed, {
    merge: true,
  });

  return NextResponse.json({ success: true, data: parsed });
}
