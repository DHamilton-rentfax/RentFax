import { PLAN_LIMITS, SOFT_WARN_THRESHOLDS } from "./limits";
import { adminDb } from "@/firebase/server";

export async function enforceUsageLimit(
  companyId: string,
  plan: string,
  event: string
) {
  if (!companyId) return { allowed: true };

  const today = new Date().toISOString().slice(0, 10);
  const isMonthly = event !== "renterSearch";

  const usageDoc = isMonthly
    ? adminDb
        .collection("companies")
        .doc(companyId)
        .collection("billingUsageMonth")
        .doc("current")
    : adminDb
        .collection("companies")
        .doc(companyId)
        .collection("billingUsage")
        .doc(today);

  const snapshot = await usageDoc.get();
  const usage = snapshot.exists ? snapshot.data()[event] || 0 : 0;

  const limit = PLAN_LIMITS[plan]?.[`${event}${isMonthly ? "Monthly" : "Daily"}`];

  if (limit === Infinity) return { allowed: true };

  const currentRatio = usage / limit;

  // Soft warnings
  for (const threshold of SOFT_WARN_THRESHOLDS) {
    if (currentRatio >= threshold && currentRatio < 1) {
      return {
        allowed: true,
        softLimit: true,
        threshold,
        usage,
        limit,
        message: `You have reached ${Math.round(threshold * 100)}% of your quota.`,
      };
    }
  }

  // Hard stop
  if (usage >= limit) {
    return {
      allowed: false,
      hardLimit: true,
      usage,
      limit,
      message: "You have reached your limit for this billing cycle.",
    };
  }

  return { allowed: true };
}
