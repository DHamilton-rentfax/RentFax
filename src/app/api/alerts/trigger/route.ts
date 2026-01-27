import { FieldValue } from "firebase-admin/firestore";

import { db } from "@/firebase/server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { renterId, score } = await req.json();
    if (!renterId || score == null)
      return NextResponse.json(
        { error: "Missing renterId or score" },
        { status: 400 },
      );

    if (score >= 40) return NextResponse.json({ skipped: true });

    // find subscribed partners
    const partnersSnap = await getDocs(
      query(
        collection(db, "partners"),
        where("subscribedToAlerts", "==", true),
      ),
    );
    const partners = partnersSnap.docs.map((d) => d.data());

    for (const partner of partners) {
      await addDoc(collection(db, "alerts"), {
        renterId,
        partnerId: partner.id,
        type: "highRisk",
        message: `High-risk renter detected: ${renterId} (Score: ${score})`,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, notified: partners.length });
  } catch (err) {
    console.error("Fraud alert trigger failed:", err);
    return NextResponse.json(
      { error: "Alert trigger failed" },
      { status: 500 },
    );
  }
}
