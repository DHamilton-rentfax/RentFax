import { adminDb } from "@/firebase/server";

export async function getOrgProvisioning(orgId: string) {
  const snap = await adminDb.collection("orgs").doc(orgId).get();

  if (!snap.exists) {
    throw new Error("ORG_NOT_PROVISIONED");
  }

  const org = snap.data()!;

  return {
    plan: org.plan,
    status: org.status,

    credits: org.credits ?? { available: 0, reserved: 0 },
    seats: org.seats ?? { limit: 0 },

    limits: org.limits,
    features: org.features,

    isActive: org.status === "ACTIVE",
  };
}
