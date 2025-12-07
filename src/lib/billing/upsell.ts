export function determineUpsellLevel(plan: string, rec: any) {
  if (!rec.shouldUpgrade) return "none";

  const count = rec.recommendations.length;

  if (plan === "free" && count > 0) return "soft";

  if (plan === "starter" && count >= 1) return "medium";

  if (plan === "pro" && count >= 2) return "hard";

  return "medium";
}
