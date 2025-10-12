
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import OpenAI from "openai";
import { authAdmin } from "@/lib/authAdmin";

export async function POST(req: Request) {
  try {
    const user = await authAdmin(req); // only admins trigger scoring
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { renterId } = body;
    if (!renterId) return NextResponse.json({ error: "Missing renterId" }, { status: 400 });

    // --- 1️⃣ Gather signals from collections ---
    const signals: any[] = [];
    const collectionsToCheck = [
      { name: "disputes", field: "renterId" },
      { name: "incidents", field: "renterId" },
      { name: "unauthorizedDrivers", field: "linkedRenterId" },
      { name: "partnerCases", field: "renterId" },
    ];

    for (const col of collectionsToCheck) {
      const q = adminDB.collection(col.name).where(col.field, "==", renterId);
      const snap = await q.get();
      snap.forEach((doc) => signals.push({ type: col.name, data: doc.data() }));
    }

    // --- 2️⃣ Score each signal ---
    const weights: Record<string, number> = {
      disputes: -20,
      incidents: -15,
      unauthorizedDrivers: -30,
      partnerCases: -10,
    };

    let rawScore = 100;
    const contributing: string[] = [];

    for (const s of signals) {
      const weight = weights[s.type] || 0;
      rawScore += weight;
      contributing.push(`${s.type}: ${weight}`);
    }

    // Recency penalty (older = less impact)
    const penalty = Math.min(signals.length * 2, 15);
    const score = Math.max(0, Math.min(100, rawScore - penalty));

    // --- 3️⃣ Summarize via AI for context ---
    let aiSummary = "AI analysis not available.";
    if (process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const summaryPrompt = `
          Generate a short human-readable summary of renter risk based on these signals:
          ${JSON.stringify(signals.slice(0, 10))}
          The calculated score is ${score}.
          Mention the main issues and the overall risk level (e.g., Low, Moderate, High, Critical).
        `;
        try {
            const aiResp = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [{ role: "system", content: summaryPrompt }],
            });
            aiSummary = aiResp.choices[0].message.content || "No AI summary was generated.";
        } catch (e) {
            console.error("OpenAI API call failed", e);
            aiSummary = "Failed to generate AI summary due to an API error."
        }
    } else {
        aiSummary = "AI analysis is disabled. No OpenAI API key is configured."
    }

    // --- 4️⃣ Save to Firestore ---
    await adminDB.collection("riskProfiles").doc(renterId).set({
      renterId,
      score,
      signalsCount: signals.length,
      contributing,
      aiSummary,
      updatedAt: new Date().toISOString(),
    });

    // after saving risk profile
    if (rawScore < 40) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alerts/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterId, score: rawScore }),
      });
    }

    // --- 5️⃣ Return response ---
    return NextResponse.json({
      success: true,
      renterId,
      score,
      contributing,
      aiSummary,
    });
  } catch (err: any) {
    console.error("Risk engine error:", err);
    // It's good practice to not expose internal error messages.
    return NextResponse.json({ error: "An unexpected error occurred in the risk engine.", details: err.message }, { status: 500 });
  }
}
