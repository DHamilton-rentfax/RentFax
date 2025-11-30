// src/lib/fraudEngine/riskEngine.ts
import { getFraudHistory } from "@/lib/fraud/history";
import { getLinkedRenters } from "@/lib/fraud/linkedRenters";

export async function riskEngine({
  userId,
  identity,
  renterData,
}: {
  userId: string;
  identity: any;
  renterData: any;
}) {
  const fraudHistory = await getFraudHistory(renterData.id);
  const linked = await getLinkedRenters(renterData.address);

  // Weighted scoring
  let score = 0;

  score += (100 - identity.identityScore) * 0.4;
  score += fraudHistory.count * 15;
  score += linked.highRiskCount * 10;

  return {
    score: Math.min(100, Math.round(score)),
    fraudHistory,
    linked,
    identity,
  };
}
