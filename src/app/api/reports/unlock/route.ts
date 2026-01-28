import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { assertReportUnlockAllowed } from "@/lib/reports/assertReportUnlockAllowed";
import { verifyCreditsOrCharge } from "@/lib/billing/verifyCreditsOrCharge";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "Organization context missing" },
        { status: 401 }
      );
    }

    const { renterId } = await req.json();
    if (!renterId) {
      return NextResponse.json(
        { error: "renterId is required" },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
     *  HARD TRUST ENFORCEMENT (NON-BYPASSABLE)
     * ------------------------------------------------------ */
    await assertReportUnlockAllowed(renterId, orgId);

    /* -------------------------------------------------------
     *  BILLING (CREDIT OR PAYG — REAL)
     * ------------------------------------------------------ */
    await verifyCreditsOrCharge({
      companyId: orgId,
      renterId,
      amountCents: 2000,
      reason: "REPORT_UNLOCK",
    });

    /* -------------------------------------------------------
     *  UNLOCK / CREATE REPORT (IDEMPOTENT)
     * ------------------------------------------------------ */
    const reportRef = adminDb
      .collection("reports")
      .doc(`${renterId}_${orgId}`);

    const snap = await reportRef.get();

    if (!snap.exists) {
      await reportRef.set({
        renterId,
        orgId,
        status: "unlocked",
        createdAt: FieldValue.serverTimestamp(),
        unlockedAt: FieldValue.serverTimestamp(),
      });
    } else if (snap.data()?.status !== "unlocked") {
      await reportRef.update({
        status: "unlocked",
        unlockedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ unlocked: true });
  } catch (err: any) {
    await adminDb.collection("unlock_attempts").add({
      orgId: req.headers.get("x-org-id"),
      renterId: (await req.json())?.renterId ?? null,
      status: "blocked",
      reason: err.message,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { error: err.message },
      { status: 403 }
    );
  }
}
