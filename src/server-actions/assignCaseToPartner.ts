"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

type AssignInput = {
  reportId: string;
  renterId: string;
  assignedByUid: string;
  assignedByCompanyId: string;
  assignedToType: "collection_agency" | "law_firm";
  assignedToOrgId: string;
};

export async function assignCaseToPartner(input: AssignInput) {
  const {
    reportId,
    renterId,
    assignedByUid,
    assignedByCompanyId,
    assignedToType,
    assignedToOrgId,
  } = input;

  // -------------------------------
  // Basic validation
  // -------------------------------
  if (!reportId?.trim()) throw new Error("reportId is required");
  if (!renterId?.trim()) throw new Error("renterId is required");
  if (!assignedByUid?.trim()) throw new Error("assignedByUid is required");
  if (!assignedByCompanyId?.trim())
    throw new Error("assignedByCompanyId is required");
  if (!assignedToOrgId?.trim()) throw new Error("assignedToOrgId is required");

  // -------------------------------
  // Fetch report + enforce lifecycle rule
  // -------------------------------
  const reportRef = adminDb.collection("reports").doc(reportId.trim());
  const reportSnap = await reportRef.get();

  if (!reportSnap.exists) {
    throw new Error("Report not found");
  }

  const report = reportSnap.data();
  if (!report) {
    // Extra guard for TS/runtime safety
    throw new Error("Report data missing");
  }

  // CRITICAL GUARD: Only finalized reports can be assigned.
  // (If your schema uses a different field, adjust here.)
  if (report.status !== "finalized") {
    throw new Error(
      "Only finalized reports can be assigned for collections or legal action."
    );
  }

  // Optional: enforce the report is tied to the renterId being passed
  // (Remove if your schema doesn't store renterId on the report)
  if (report.renterId && report.renterId !== renterId) {
    throw new Error("renterId does not match the report's renterId");
  }

  // -------------------------------
  // Create assignment case
  // -------------------------------
  const caseRef = adminDb.collection("case_assignments").doc();

  await caseRef.set({
    caseId: caseRef.id,
    reportId: reportId.trim(),
    renterId: renterId.trim(),

    assignedByUid: assignedByUid.trim(),
    assignedByCompanyId: assignedByCompanyId.trim(),

    assignedToType,
    assignedToOrgId: assignedToOrgId.trim(),

    status: "assigned",

    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { caseId: caseRef.id };
}
