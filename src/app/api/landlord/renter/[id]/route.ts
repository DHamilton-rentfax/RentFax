import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req, { params }) {
  const id = params.id;

  const renterRef = adminDb.collection("renters").doc(id);
  const renterSnap = await renterRef.get();

  if (!renterSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const renter = renterSnap.data();

  const incidents = await renterRef.collection("incidents").orderBy("createdAt", "asc").get();
  const disputes = await renterRef.collection("disputes").get();
  const fraudSignals = await renterRef.collection("fraudSignals").get();

  const aiRef = renterRef.collection("aiReports").doc("riskSummary");
  const aiSnap = await aiRef.get();

  return NextResponse.json({
    renter: {
      id,
      ...renter,
    },
    factors: {
      incidents: incidents.size,
      disputes: disputes.size,
      fraudSignals: fraudSignals.size,
      verified: renter.verified || false,
      aiRiskScore: renter.aiRiskScore || 0,
    },
    incidents: incidents.docs.map((d) => ({ id: d.id, ...d.data() })),
    disputes: disputes.docs.map((d) => ({ id: d.id, ...d.data() })),
    fraudSignals: fraudSignals.size,
    fraudSignalsDetailed: fraudSignals.docs.map((d) => d.data()),
    aiSummary: aiSnap.exists ? aiSnap.data().summary : null,
  });
}