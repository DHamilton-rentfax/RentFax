import { computeRiskScore } from "./computeRiskScore";
import { computeConfidenceScore } from "./computeConfidenceScore";
import { detectSignals } from "./detectSignals";
import { getIdentityScore } from "@/lib/identity/confidence";
import { RenterProfile } from "@/types/risk";

export async function buildFullRiskProfile(profile: RenterProfile) {
  const riskScore = computeRiskScore({
    incidents: profile.incidents ?? [],
    disputes: profile.disputes ?? [],
    payments: profile.payments ?? [],
  });

  const signals = detectSignals(profile);

  const identityScore = getIdentityScore(profile.identityChecks);

  const confidence = computeConfidenceScore({
    identityScore,
    riskScore,
    signals,
  });

  return {
    riskScore,
    confidenceScore: confidence,
    signals,
  };
}