"use server";

import { adminDb } from "@/firebase/server";

export async function recordBillingEventFromCaseStatus({
  partnerOrgId,
  partnerType,
  caseId,
  reportId,
  newStatus,
}: {
  partnerOrgId: string;
  partnerType: "collection_agency" | "law_firm";
  caseId: string;
  reportId?: string;
  newStatus: "in_review" | "action_taken" | "closed" | string;
}) {
  let eventType: "CASE_ACTION_TAKEN" | "CASE_CLOSED" | null = null;

  if (newStatus === "action_taken") eventType = "CASE_ACTION_TAKEN";
  if (newStatus === "closed") eventType = "CASE_CLOSED";

  if (!eventType) return;

  await adminDb.collection("partner_billing_events").add({
    partnerOrgId,
    partnerType,
    caseId,
    reportId: reportId ?? null,
    eventType,
    units: 1,
    occurredAt: new Date(),
    createdAt: new Date(),
    source: "case_status",
  });
}
