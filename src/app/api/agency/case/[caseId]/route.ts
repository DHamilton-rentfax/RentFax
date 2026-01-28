import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { logReportAccess } from "@/server-actions/logReportAccess";

/**
 * NOTE:
 * In production, partnerOrgId, uid, email, role
 * come from session / auth middleware.
 */
export async function GET(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { caseId } = params;

  // 🔐 TODO: replace with real auth extraction
  const partnerOrgId = "PARTNER_ORG_ID_FROM_TOKEN";
  const viewer = {
    uid: "partner-user-id",
    email: "partner@example.com",
  };

  // 1. Fetch case
  const caseSnap = await adminDb
    .collection("case_assignments")
    .doc(caseId)
    .get();

  if (!caseSnap.exists) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const caseData = caseSnap.data();

  // 🔒 Enforce assignment
  if (caseData.assignedToOrgId !== partnerOrgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 2. Fetch report
  const reportSnap = await adminDb
    .collection("reports")
    .doc(caseData.reportId)
    .get();

  if (!reportSnap.exists) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = reportSnap.data();

  // 3. Log access (external partner)
  await logReportAccess({
    reportId: caseData.reportId,
    uid: viewer.uid,
    email: viewer.email,
    accountType: "external_partner",
    companyId: null,
    intentId: null,
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "unknown",
  });

  return NextResponse.json({
    case: caseData,
    report,
  });
}
