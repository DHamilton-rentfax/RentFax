import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { calculateCompanyBadges } from "@/lib/company/calc-badges";

export async function POST(req: Request) {
  const { companyId } = await req.json();

  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const metricsDoc = await adminDb
    .collection("companyBehaviorMetrics")
    .doc(companyId)
    .get();

  if (!companyDoc.exists || !metricsDoc.exists) {
    return NextResponse.json({ error: "Missing data" });
  }

  const badges = calculateCompanyBadges(
    metricsDoc.data(),
    companyDoc.data()
  );

  await adminDb
    .collection("companyBadges")
    .doc(companyId)
    .set(
      {
        badges,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

  return NextResponse.json({ success: true, badges });
}
