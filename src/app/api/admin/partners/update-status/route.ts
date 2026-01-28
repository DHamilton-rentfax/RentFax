// ============================================================
// RentFAX | Admin Partner Verification Update API
// File: /src/app/api/admin/partners/update-status/route.ts
// ============================================================
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { logAudit } from "@/lib/auditLogger";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const { partnerId, type, newStatus, adminEmail, adminUid } = body;

    if (!partnerId || !type || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine the collection (agencies or legal partners)
    const collectionName =
      type === "collectionAgencies" || type === "agency"
        ? "collectionAgencies"
        : "legalPartners";

    const partnerRef = adminDb.collection(collectionName).doc(partnerId);
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
          ? new Date()
          : admin.firestore.FieldValue.delete(),
      lastUpdatedBy: adminEmail || "admin@rentfax.io",
      lastUpdatedAt: new Date(),
    });

    // Log to audit
    await logAudit("PARTNER_VERIFICATION", `Partner ${partnerId} → ${newStatus}`, {
      performedBy: adminUid || "system",
      performedByEmail: adminEmail || "admin@rentfax.io",
      targetId: partnerId,
      targetType: collectionName,
    });

    // Add a small in-database activity record for display in partner dashboards
    await adminDb.collection("notifications").add({
      type: "partner_verification_update",
      partnerId,
      partnerType: collectionName,
      status: newStatus,
      message: `Your verification status has been updated to "${newStatus}"`,
      timestamp: new Date(),
      read: false,
    });

    console.log(`✅ Updated ${collectionName}/${partnerId} to ${newStatus}`);

    return NextResponse.json({
      success: true,
      message: `Partner status updated to ${newStatus}`,
    });
  } catch (err: any) {
    console.error("❌ Error updating partner status:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
