"use server";

import { adminDb } from "@/firebase/server";

export async function approvePartnerStatement({
  statementId,
  approvedByUid,
}: {
  statementId: string;
  approvedByUid: string;
}) {
  const ref = adminDb.collection("partner_billing_statements").doc(statementId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Statement not found");

  await ref.update({
    status: "approved",
    approvedByUid,
    updatedAt: new Date(),
  });
}
