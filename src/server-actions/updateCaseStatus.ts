"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

type UpdateCaseStatusInput = {
  caseId: string;
  newStatus: "in_review" | "action_taken" | "closed";
  partnerOrgId: string;
};

export async function updateCaseStatus(input: UpdateCaseStatusInput) {
  const { caseId, newStatus, partnerOrgId } = input;

  // -------------------------------
  // Basic validation
  // -------------------------------
  if (!caseId?.trim()) {
    throw new Error("caseId is required");
  }

  if (!partnerOrgId?.trim()) {
    throw new Error("partnerOrgId is required");
  }

  if (!newStatus) {
    throw new Error("newStatus is required");
  }

  // -------------------------------
  // Fetch case assignment
  // -------------------------------
  const caseRef = adminDb
    .collection("case_assignments")
    .doc(caseId.trim());

  const snap = await caseRef.get();

  if (!snap.exists) {
    throw new Error("Case not found");
  }

  const caseData = snap.data();
  if (!caseData) {
    throw new Error("Case data missing");
  }

  // -------------------------------
  // 🔒 Authorization guard
  // -------------------------------
  if (caseData.assignedToOrgId !== partnerOrgId) {
    throw new Error("Unauthorized to update this case");
  }

  // -------------------------------
  // Update status
  // -------------------------------
  await caseRef.update({
    status: newStatus,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    caseId: caseRef.id,
    status: newStatus,
  };
}
