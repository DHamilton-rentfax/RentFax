import { buildTimeline } from "@/lib/timeline/buildTimeline";
import { adminDb } from "@/firebase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeRenterBehavior(renterId: string) {
  const collections = await Promise.all([
    adminDb.collection("incidents").where("renterId", "==", renterId).get(),
    adminDb.collection("disputes").where("renterId", "==", renterId).get(),
    adminDb.collection("payments").where("renterId", "==", renterId).get(),
    adminDb.collection("verifications").where("renterId", "==", renterId).get(),
    adminDb.collection("flags").where("renterId", "==", renterId).get(),
    adminDb.collection("overrides").where("renterId", "==", renterId).get(),
    adminDb.collection("freezes").where("renterId", "==", renterId).get(),
    adminDb.collection("users").doc(renterId).get(),
  ]);

  const [
    incSnap,
    disSnap,
    paySnap,
    verSnap,
    flagSnap,
    overSnap,
    freezeSnap,
    userDoc,
  ] = collections;

  const timeline = buildTimeline({
    incidents: incSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    disputes: disSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    payments: paySnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    verifications: verSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    flags: flagSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    overrides: overSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    freezes: freezeSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  });

  const user = userDoc.data() ?? {};

  const prompt = `
You are an AI risk analyst for RentFAX. Analyze this renter’s full timeline and produce professional insights.

USER:
${JSON.stringify(user, null, 2)}

TIMELINE EVENTS:
${JSON.stringify(timeline, null, 2)}

OUTPUT FORMAT (JSON):
{
  "summary": "A 3–5 sentence overview of behavior.",
  "positives": ["good behavior patterns"],
  "negatives": ["red flags"],
  "consistencyScore": 0-100,
  "trajectory": "improving | declining | volatile | stable",
  "overallClassification": "favorable | uncertain | unfavorable",
  "recommendations": ["actions a landlord should take"],
  "signalHighlights": ["incidents or disputes to pay attention to"]
}
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { error: "AI JSON parsing failed", raw: text };
  }
}
