"use server";

import { adminAuth, adminDb } from "@/firebase/server";

export async function invitePartnerUser({
  email,
  partnerOrgId,
  partnerType,
}: {
  email: string;
  partnerOrgId: string;
  partnerType: "collection_agency" | "law_firm";
}) {
  const user = await adminAuth.createUser({ email });

  await adminAuth.setCustomUserClaims(user.uid, {
    role: "external_partner",
    partnerOrgId,
    partnerType,
  });

  await adminDb.collection("users").doc(user.uid).set({
    uid: user.uid,
    email,
    role: "external_partner",
    partnerOrgId,
    partnerType,
    createdAt: new Date(),
  });

  return { uid: user.uid };
}
