"use server";

import { adminDb } from "@/firebase/server";

export async function startPartnerTrial({
  partnerOrgId,
}: {
  partnerOrgId: string;
}) {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 30);

  await adminDb.collection("partner_orgs").doc(partnerOrgId).update({
    billing: {
      status: "trial",
      trialEndsAt,
    },
  });
}
