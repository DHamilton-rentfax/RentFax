// src/lib/fraudEngine/syncIncident.ts
import { adminDB } from "@/firebase/server";

export async function syncIncident({
  renterId,
  risk,
  identity,
}: {
  renterId: string;
  risk: any;
  identity: any;
}) {
  const ref = adminDB.collection("incidents").doc();

  await ref.set({
    renterId,
    type: "AUTO_FRAUD_FLAG",
    riskScore: risk.score,
    identityScore: identity.identityScore,
    createdAt: Date.now(),
    automated: true,
  });

  return ref.id;
}
