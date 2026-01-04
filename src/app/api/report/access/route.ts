import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const { purchaserUid, reportNameId } = await req.json();

  if (!purchaserUid || !reportNameId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const userRef = adminDb.collection("users").doc(purchaserUid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = userSnap.data()!;
  const credits = user.reportCredits || 0;

  // ✅ CREDIT PATH (NO STRIPE, NO EMAIL)
  if (credits > 0) {
    await userRef.update({
      reportCredits: credits - 1,
    });

    await adminDb
      .collection("reports")
      .doc(reportNameId) // ⚠️ nameId pattern respected
      .update({
        unlocked: true,
        unlockedAt: Timestamp.now(),
        accessType: "CREDIT",
      });

    await adminDb.collection("reportLedger").add({
      purchaserUid,
      reportNameId,
      accessMethod: "CREDIT",
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ access: "granted", method: "credit" });
  }

  // ❌ NO CREDIT → REQUIRE PAYMENT
  return NextResponse.json({ access: "payment_required" });
}
