
import { normalizeIncident } from "./normalizer";
import { scoreBehavior } from "./behavior-scorer";
import { adminDb } from "@/firebase/server";

export async function computeCrossIndustryRisk(renterId: string) {
  const snapshot = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  let total = 0;
  const breakdown: Record<string, number> = {};

  snapshot.docs.forEach((doc) => {
    const i = doc.data();
    const normalized = normalizeIncident(i.industry, i.type);
    const score = scoreBehavior(normalized);

    total += score;
    breakdown[normalized] = (breakdown[normalized] || 0) + score;
  });

  // Categorize renter
  let tier = "LOW";
  if (total > 100) tier = "MEDIUM";
  if (total > 200) tier = "HIGH";
  if (total > 350) tier = "SEVERE";

  await adminDb.collection("renters").doc(renterId).set(
    {
      crossIndustryRiskScore: total,
      crossIndustryTier: tier,
      crossIndustryBreakdown: breakdown,
    },
    { merge: true }
  );

  return { total, tier, breakdown };
}
