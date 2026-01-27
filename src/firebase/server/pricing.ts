import { adminDb } from "@/firebase/server";

export async function getPricingConfig() {
  const ref = adminDb.doc("config/rentfax-pricing");
  const snap = await ref.get();
  return snap.exists ? snap.data() : null;
}

export async function updatePricingConfig(data: any) {
  const ref = adminDb.doc("config/rentfax-pricing");
  await ref.set(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
