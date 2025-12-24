"use server";

import { adminDb } from "@/firebase/server";
import { logPartnerUsage } from "./logPartnerUsage";

export async function addCaseNote({
  caseId,
  partnerOrgId,
  partnerUid,
  partnerType,
  note,
}: {
  caseId: string;
  partnerOrgId: string;
  partnerUid: string;
  partnerType: "collection_agency" | "law_firm";
  note: string;
}) {
  const caseSnap = await adminDb
    .collection("case_assignments")
    .doc(caseId)
    .get();

  if (!caseSnap.exists) throw new Error("Case not found");
  if (caseSnap.data()!.assignedToOrgId !== partnerOrgId) {
    throw new Error("Unauthorized");
  }

  await adminDb.collection("case_notes").add({
    caseId,
    partnerOrgId,
    partnerUid,
    partnerType,
    note,
    createdAt: new Date(),
  });

  await logPartnerUsage({
    partnerOrgId,
    partnerType,
    partnerUid,
    eventType: "CASE_NOTE_ADDED",
    caseId,
  });
}
