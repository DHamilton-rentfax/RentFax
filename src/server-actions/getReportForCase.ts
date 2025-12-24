"use server";

import { adminDb } from "@/firebase/server";
import { logReportAccess } from "@/server-actions/logReportAccess";

type GetReportForCaseInput = {
  caseId: string;
  partnerOrgId: string;
  viewer: {
    uid: string;
    email: string;
  };
  requestMeta: {
    ip: string;
    userAgent: string;
  };
};

export async function getReportForCase(input: GetReportForCaseInput) {
  const { caseId, partnerOrgId, viewer, requestMeta } = input;

  // -------------------------------
  // Basic validation
  // -------------------------------
  if (!caseId?.trim()) throw new Error("caseId is required");
  if (!partnerOrgId?.trim()) throw new Error("partnerOrgId is required");
  if (!viewer?.uid) throw new Error("viewer.uid is required");

  // -------------------------------
  // Fetch case assignment
  // -------------------------------
  const caseSnap = await adminDb
    .collection("case_assignments")
    .doc(caseId.trim())
    .get();

  if (!caseSnap.exists) {
    throw new Error("Case not found");
  }

  const caseData = caseSnap.data();
  if (!caseData) {
    throw new Error("Case data missing");
  }

  // 🔒 Enforce assignment ownership
  if (caseData.assignedToOrgId !== partnerOrgId) {
    throw new Error("Unauthorized access to this case");
  }

  if (!caseData.reportId) {
    throw new Error("Case is not linked to a report");
  }

  // -------------------------------
  // Fetch report
  // -------------------------------
  const reportSnap = await adminDb
    .collection("reports")
    .doc(caseData.reportId)
    .get();

  if (!reportSnap.exists) {
    throw new Error("Report not found");
  }

  const report = reportSnap.data();
  if (!report) {
    throw new Error("Report data missing");
  }

  // -------------------------------
  // Log access (external partner audit trail)
  // -------------------------------
  await logReportAccess({
    reportId: caseData.reportId,
    uid: viewer.uid,
    email: viewer.email,
    accountType: "external_partner",
    companyId: null,
    intentId: null,
    ip: requestMeta.ip,
    userAgent: requestMeta.userAgent,
  });

  return {
    reportId: reportSnap.id,
    ...report,
  };
}
