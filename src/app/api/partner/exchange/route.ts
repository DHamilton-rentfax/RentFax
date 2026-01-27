import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// helper: validate partner API key
async function validatePartner(req: Request) {
  const key = headers().get("x-partner-key");
  if (!key) return null;

  const docRef = doc(db, "partners", key);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;

  const partner = snap.data();
  if (!partner.active) return null;
  return { id: key, ...partner };
}

export async function POST(req: Request) {
  try {
    const partner = await validatePartner(req);
    if (!partner)
      return NextResponse.json(
        { error: "Invalid partner key" },
        { status: 403 },
      );

    const body = await req.json();
    const { renterId, outcome, amount, notes } = body;

    if (!renterId || !outcome)
      return NextResponse.json(
        { error: "Missing renterId or outcome" },
        { status: 400 },
      );

    // 1️⃣ record partner submission
    const record = await addDoc(collection(db, "partnerCases"), {
      renterId,
      outcome, // paid | defaulted | legal_action | insurance_claim
      amount: amount || null,
      notes: notes || "",
      partnerId: partner.id,
      partnerName: partner.name,
      receivedAt: new Date().toISOString(),
    });

    // 2️⃣ update renter’s risk profile baseline
    const riskDoc = doc(db, "riskProfiles", renterId);
    const riskSnap = await getDoc(riskDoc);
    if (riskSnap.exists()) {
      const risk = riskSnap.data();
      let score = risk.score;

      if (outcome === "defaulted") score -= 15;
      if (outcome === "legal_action") score -= 10;
      if (outcome === "paid") score += 5;

      await updateDoc(riskDoc, {
        score: Math.max(0, Math.min(100, score)),
        updatedAt: new Date().toISOString(),
      });
    }

    // 3️⃣ optional: trigger AI risk re-evaluation
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/risk-engine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ renterId }),
    });

    // 4️⃣ log alert event
    await addDoc(collection(db, "alerts"), {
      type: "partnerUpdate",
      renterId,
      message: `${partner.name} submitted outcome: ${outcome}`,
      createdAt: new Date().toISOString(),
    });

    revalidatePath(`/admin/risk-dashboard`);
    return NextResponse.json({ success: true, recordId: record.id });
  } catch (err) {
    console.error("Partner exchange error:", err);
    return NextResponse.json({ error: "Exchange failed" }, { status: 500 });
  }
}
