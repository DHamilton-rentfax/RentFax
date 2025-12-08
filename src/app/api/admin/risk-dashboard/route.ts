import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { convertToCreditRange } from "@/lib/risk/convertScore";
import { computeRiskScore } from "@/lib/risk/computeRiskScore";
import { computeConfidenceScore } from "@/lib/risk/computeConfidenceScore";
import { detectSignals } from "@/lib/risk/detectSignals";

export async function GET() {
  const rentersSnap = await adminDb.collection("renters").get();

  const items: any[] = [];

  for (const doc of rentersSnap.docs) {
    const renter = { renterId: doc.id, ...doc.data() };

    const incSnap = await adminDb
      .collection("incidents")
      .where("renterId", "==", doc.id)
      .get();

    const dispSnap = await adminDb
      .collection("disputes")
      .where("renterId", "==", doc.id)
      .get();

    const incidents = incSnap.docs.map((d) => d.data());
    const disputes = dispSnap.docs.map((d) => d.data());

    const signals = detectSignals({
      renter,
      incidents,
      disputes,
      payload: renter, // baseline analysis
    });

    const riskScore = computeRiskScore({
      renter,
      incidents,
      disputes,
      signals,
    });

    const confidenceScore = computeConfidenceScore({
      renter,
      payload: renter,
      signals,
    });

    items.push({
      renterId: renter.renterId,
      fullName: renter.fullName,
      email: renter.email,
      riskScore: convertToCreditRange(riskScore.score),
      confidenceScore: confidenceScore.score,
      signals,
      riskLevel:
        riskScore.score < 40
          ? "HIGH"
          : riskScore.score < 70
          ? "MEDIUM"
          : "LOW",
    });
  }

  return NextResponse.json({ items });
}
