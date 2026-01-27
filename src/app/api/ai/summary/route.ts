import { FieldValue } from "firebase-admin/firestore";
// ===========================================
// RentFAX | AI Summary Generator
// Location: src/app/api/ai/summary/route.ts
// ===========================================

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/firebase/server";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();
    if (!renterId)
      return NextResponse.json({ success: false, error: "Missing renterId" }, { status: 400 });

    // 🔹 Pull renter data
    const renterSnap = await getDoc(doc(db, "renterProfiles", renterId));
    if (!renterSnap.exists())
      return NextResponse.json({ success: false, error: "Renter not found" }, { status: 404 });

    const renter = renterSnap.data();

    // 🔹 Fetch related records
    const reviewsQ = query(collection(db, "rentalReviews"), where("renterRef", "==", renterId));
    const incidentsQ = query(collection(db, "incidents"), where("renterRef", "==", renterId));

    const [reviewsSnap, incidentsSnap] = await Promise.all([
      getDocs(reviewsQ),
      getDocs(incidentsQ),
    ]);

    const reviews = reviewsSnap.docs.map((d) => d.data());
    const incidents = incidentsSnap.docs.map((d) => d.data());

    const prompt = `
You are the RentFAX AI Engine. Summarize the renter's trustworthiness.

Renter:
- Name: ${renter.name}
- Behavior Score: ${renter.behaviorScore ?? "N/A"}
- Risk Score: ${renter.riskScore ?? "N/A"}
- Verified Fields: ${JSON.stringify(renter.verifiedFields || {})}
- Number of Reviews: ${reviews.length}
- Number of Incidents: ${incidents.length}

Reviews Summary: ${reviews.map(
      (r) => `Timeliness ${r.timelinessScore}, Cleanliness ${r.cleanlinessScore}, Communication ${r.communicationScore}`
    )}
Incidents: ${incidents.map((i) => i.title || "Unnamed Incident")}

Output a short paragraph summarizing their reliability, risk level, and recommendation for landlords.
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 200,
    });

    const summary = aiResponse.choices[0].message?.content ?? "No summary generated.";

    return NextResponse.json({ success: true, renterId, summary });
  } catch (err) {
    console.error("AI Summary error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
