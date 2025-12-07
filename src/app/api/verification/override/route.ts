
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import admin from "firebase-admin";
import { recomputeFraudScore } from "@/lib/fraud/recompute-score";

export async function POST(req: Request) {
  try {
    const { renterId, newStatus, reason, adminId } = await req.json();

    if (!renterId || !newStatus) {
      return NextResponse.json(
        { error: "Missing renterId or newStatus." },
        { status: 400 }
      );
    }

    const renterRef = adminDb.collection("renters").doc(renterId);

    await renterRef.update({
      verificationStatus: newStatus,
      verificationMethod: "manual",
      verificationStrength:
        newStatus === "verified"
          ? "strong"
          : newStatus === "partial"
          ? "medium"
          : "none",
      verificationOverrides: admin.firestore.FieldValue.arrayUnion({
        status: newStatus,
        reason,
        adminId,
        timestamp: Date.now(),
      }),
    });

    // Recompute fraud score automatically
    await recomputeFraudScore(renterId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification override error:", err);
    return NextResponse.json(
      { error: "Failed to override verification." },
      { status: 500 }
    );
  }
}
