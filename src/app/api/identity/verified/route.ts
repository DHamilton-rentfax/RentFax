import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { renterId, verificationData } = await req.json();

  await adminDb.collection("renters").doc(renterId).update({
    verified: true,
    verificationData,
    updatedAt: Date.now(),
  });

  const incidentSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  // Adjust risk because verification lowers risk slightly
  await adminDb.collection("renters").doc(renterId).update({
    riskVerifiedReduction: true,
  });

  return NextResponse.json({ success: true });
}
