"use server";

import { adminDb } from "@/firebase/server";

export async function updatePartnerBillingStatus({
  partnerOrgId,
  status,
  extendTrialDays,
}: {
  partnerOrgId: string;
  status: "trial" | "active" | "expired" | "suspended";
  extendTrialDays?: number;
}) {
  const updates: any = {
    "billing.status": status,
  };

  if (extendTrialDays) {
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + extendTrialDays);
    updates["billing.trialEndsAt"] = newEnd;
  }

  await adminDb
    .collection("partner_orgs")
    .doc(partnerOrgId)
    .update(updates);
}
