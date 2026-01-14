import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { getOrgProvisioning } from "@/lib/provisioning/getOrgProvisioning";

/* -------------------------------------------------------------------------- */
/* POST — UNLOCK REPORT (BETA RULES)                                           */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    /* -------------------------------------------------------
     *  ORG CONTEXT (SERVER TRUST ONLY)
     * ------------------------------------------------------ */
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "Organization context missing" },
        { status: 401 }
      );
    }

    const { reportId } = await req.json();
    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------
     *  PROVISIONING ENFORCEMENT
     * ------------------------------------------------------ */
    const prov = await getOrgProvisioning(orgId);

    if (!prov.isActive) {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
     *  LOAD REPORT + OWNERSHIP CHECK
     * ------------------------------------------------------ */
    const reportRef = adminDb.collection("reports").doc(reportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const report = reportSnap.data()!;
    if (report.orgId !== orgId) {
      return NextResponse.json(
        { error: "Unauthorized access to report" },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
     *  STRONG IDENTITY ENFORCEMENT (BETA)
     * ------------------------------------------------------ */
    const identitySnap = await adminDb
      .collection("identity_signals")
      .where("orgId", "==", orgId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (identitySnap.empty) {
      return NextResponse.json(
        { error: "Identity verification required" },
        { status: 403 }
      );
    }

    const identity = identitySnap.docs[0].data();

    // PDPL = BASIC ONLY → BLOCK
    if (identity.provider === "PDPL") {
      return NextResponse.json(
        { error: "Strong identity verification required" },
        { status: 403 }
      );
    }

    /* -------------------------------------------------------
     *  IDPOTENT UNLOCK CHECK
     * ------------------------------------------------------ */
    if (report.status === "unlocked") {
      return NextResponse.json({ unlocked: true });
    }

    /* -------------------------------------------------------
     *  UNLOCK REPORT (NO STRIPE, NO PAYG IN BETA)
     * ------------------------------------------------------ */
    await reportRef.update({
      status: "unlocked",
      unlockedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      unlocked: true,
      reportId,
    });
  } catch (err: any) {
    console.error("Report unlock error:", err);
    return NextResponse.json(
      { error: err.message || "Server error during report unlock" },
      { status: 500 }
    );
  }
}
