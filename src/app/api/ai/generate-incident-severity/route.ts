import { adminDB } from "@/firebase/server";
import { NextResponse } from "next/server";
// Assuming a utility for AI model generation exists. For now, we'll mock it.
// import { generateModel } from "@/utils/ai";

// Mock function until the real one is implemented
async function generateModel(prompt: string): Promise<string> {
  console.log("AI Model Prompt (mocked for incident severity):", prompt);
  // This mock needs to return a JSON string with incident IDs as keys.
  // We'll create a plausible-looking mock based on the prompt structure.
  return JSON.stringify({
    "incident123": {
      "severity": 78,
      "label": "High",
      "rationale": "Non-payment for 3 months and eviction filing."
    },
    "incident456": {
      "severity": 42,
      "label": "Medium",
      "rationale": "Late payment but debt corrected quickly."
    }
  });
}


export async function POST(req: Request) {
  const { renterId, incidents } = await req.json();

  const prompt = `
    Analyze each incident for renter ${renterId}.
    For each incident, produce:
    - severity score 0–100
    - label: Low, Medium, High, or Critical
    - 1 sentence rationale
    
    Return JSON keyed by incidentId.
  `;

  // In a real scenario, you'd pass the actual incidents data to the model.
  // For now, the mock function doesn't use the 'incidents' variable.
  const out = await generateModel(prompt);
  const parsed = JSON.parse(out);

  await adminDB
    .collection("aiIncidentSeverity")
    .doc(renterId)
    .set(parsed, { merge: true });

  return NextResponse.json({ success: true, data: parsed });
}
