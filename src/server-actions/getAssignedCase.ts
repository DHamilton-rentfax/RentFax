"use server";

import { adminDb } from "@/firebase/server";

export async function getAssignedCases(orgId: string) {
  if (!orgId?.trim()) {
    throw new Error("orgId is required");
  }

  const snap = await adminDb
    .collection("case_assignments")
    .where("assignedToOrgId", "==", orgId.trim())
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs
    .map((doc) => {
      const caseData = doc.data();
      if (!caseData) return null;

      return {
        id: doc.id,
        ...caseData,
      };
    })
    .filter(Boolean);
}
