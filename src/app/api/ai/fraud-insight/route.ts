// ===========================================
// RentFAX | AI Fraud Insight Generator
// Location: src/app/api/ai/fraud-insight/route.ts
// ===========================================

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import OpenAI from "openai";

// --- Initialize AI client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();
    if (!renterId)
      return NextResponse.json({ error: "Missing renterId" }, { status: 400 });

    // ---- Fetch renter and related data ----
    const renterRef = doc(db, "renterProfiles", renterId);
    const renterSnap = await getDoc(renterRef);
    if (!renterSnap.exists())
      return NextResponse.json({ error: "Renter not found" }, { status: 404 });

    const renter = renterSnap.data();

    // --- Optional: Caching ---
    if (renter.aiInsight && renter.aiConfidence) {
      return NextResponse.json({
        renterId,
        insight: renter.aiInsight,
        confidence: renter.aiConfidence,
        cached: true,
      });
    }

    const signalsSnap = await getDocs(
      query(collection(db, "fraudSignals"), where("renterId", "==", renterId))
    );
    const disputesSnap = await getDocs(
      query(collection(db, "disputes"), where("renterId", "==", renterId))
    );

    const signals = signalsSnap.docs.map((d) => d.data());
    const disputes = disputesSnap.docs.map((d) => d.data());
    const unresolved = disputes.filter((d) => d.status !== "resolved");

    // ---- Build context for AI ----
    const prompt = `
You are a fraud risk analyst for RentFAX.
Analyze the renter profile data below and summarize their identity risk.

Renter Name: ${renter.name}
Fraud Score: ${renter.riskScore ?? "N/A"}
Alert: ${renter.alert ? "true" : "false"}
Fraud Signals: ${signals.length}
Shared Identifiers: ${JSON.stringify(renter.sharedIdentifiers || [])}
Unresolved Disputes: ${unresolved.length}

Generate a concise 2-3 sentence insight for non-technical reviewers.
Tone: factual, clear, professional.
Also estimate a 0–100 confidence score based on data strength.
Return JSON like:
{ "insight": "...", "confidence": 87 }
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const text = completion.choices[0].message.content ?? "{}";
    const parsed =
      text.startsWith("{") && text.endsWith("}")
        ? JSON.parse(text)
        : { insight: text.trim(), confidence: 75 };
    
    // --- Cache the result ---
    await updateDoc(renterRef, {
        aiInsight: parsed.insight,
        aiConfidence: parsed.confidence,
        aiInsightUpdatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      renterId,
      insight: parsed.insight ?? text,
      confidence: parsed.confidence ?? 75,
    });
  } catch (err) {
    console.error("AI insight error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}