// ============================================================
// RentFAX | Admin Partner Verification Update API
// File: /src/app/api/admin/partners/update-status/route.ts
// ============================================================

import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { logAudit } from "@/lib/audit";
import { FieldValue } from "firebase-admin/firestore";

type UpdatePartnerStatusPayload = {
  partnerId: string;
  type: "collectionAgencies" | "agency" | "legalPartners";
  newStatus: "verified" | "rejected" | "pending";
  adminEmail?: string;
  adminUid?: string;
};

export async function POST(req: Request) {
  const db = adminDb();
  if (!db) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = (await req.json()) as UpdatePartnerStatusPayload;

    const {
      partnerId,
      type,
      newStatus,
      adminEmail,
      adminUid,
    } = body;

    // Basic validation
    if (!partnerId || !type || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Resolve collection name explicitly
    const collectionName =
      type === "collectionAgencies" || type === "agency"
        ? "collectionAgencies"
        : "legalPartners";

    const partnerRef = db.collection(collectionName).doc(partnerId);
    const partnerSnap = await partnerRef.get();

    if (!partnerSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Partner not found" },
        { status: 404 }
      );
    }

    // Update verification status
    await partnerRef.update({
      verificationStatus: newStatus,
      verifiedAt:
        newStatus === "verified"
          ? FieldValue.serverTimestamp()
          : FieldValue.delete(),
      lastUpdatedBy: adminEmail || "admin@rentfax.io",
      lastUpdatedAt: FieldValue.serverTimestamp(),
    });

    // Audit log (immutable)
    await logAudit({
      action: "PARTNER_VERIFICATION_UPDATE",
      actor: {
        uid: adminUid || "system",
        email: adminEmail || "admin@rentfax.io",
      },
      target: {
        uid: partnerId,
      },
      details: {
        partnerType: collectionName,
        newStatus,
      },
    });

    // Partner-facing notification
    await db.collection("notifications").add({
      type: "partner_verification_update",
      partnerId,
      partnerType: collectionName,
      status: newStatus,
      message: `Your verification status has been updated to "${newStatus}"`,
      timestamp: FieldValue.serverTimestamp(),
      read: false,
    });

    console.log(
      `✅ Partner verification updated: ${collectionName}/${partnerId} → ${newStatus}`
    );

    return NextResponse.json({
      success: true,
      message: `Partner status updated to ${newStatus}`,
    });
  } catch (error: any) {
    console.error("❌ Error updating partner status:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
