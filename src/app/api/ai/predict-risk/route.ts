import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();
    if (!renterId)
      return NextResponse.json({ error: "Missing renterId" }, { status: 400 });

    const q = query(
      collection(db, "riskProfiles"),
      where("renterId", "==", renterId),
    );
    const snap = await getDocs(q);
    if (snap.empty)
      return NextResponse.json(
        { error: "No risk profile found" },
        { status: 404 },
      );

    const profile = snap.docs[0].data();

    // Fetch related historical data
    const disputes = await getDocs(
      query(collection(db, "disputes"), where("renterId", "==", renterId)),
    );
    const incidents = await getDocs(
      query(collection(db, "incidents"), where("renterId", "==", renterId)),
    );
    const unauthorized = await getDocs(
      query(
        collection(db, "unauthorizedDrivers"),
        where("linkedRenterId", "==", renterId),
      ),
    );

    const dataSummary = {
      score: profile.score,
      signals: profile.signalsCount,
      disputes: disputes.size,
      incidents: incidents.size,
      unauthorizedDrivers: unauthorized.size,
      lastUpdate: profile.updatedAt,
    };

    // AI Model: Predict likelihood of issues within 3 months
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
      You are an AI risk forecaster. Given this renter data:
      ${JSON.stringify(dataSummary)}
      Estimate:
      - Default probability (0–100%)
      - Dispute probability (0–100%)
      - Fraud probability (0–100%)
      Provide the result in JSON with fields {default, dispute, fraud, summary}.
    `;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const resultText = ai.choices[0].message.content || "{}";
    const forecast = JSON.parse(resultText);

    // Save forecast to a new collection
    await db.collection("riskForecasts").doc(renterId).set({
      renterId,
      forecast,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      renterId,
      forecast,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("AI predictive risk error:", err);
    return NextResponse.json({ error: "AI forecast failed" }, { status: 500 });
  }
}
