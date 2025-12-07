export function computeCrossIdentityRisk(profile: any) {
  let score = 0;

  // Add behavior risk
  score += profile.crossIndustryRiskScore;

  // Add identity weakness
  if (profile.identityConfidence < 40) score += 40;
  if (profile.identityConfidence < 20) score += 80;

  // Add risk from linked identities
  const linkCount = profile.shadowConnections?.length || 0;
  score += linkCount * 20;

  // Cluster risk
  if (profile.clusterId) score += 60;

  // Tiering
  let tier = "LOW";
  if (score > 100) tier = "MEDIUM";
  if (score > 200) tier = "HIGH";
  if (score > 350) tier = "SEVERE";

  return { score, tier };
}
