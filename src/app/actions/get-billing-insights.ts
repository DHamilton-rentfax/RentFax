"use server";

import { adminDb } from "@/firebase/server";
import { getPricingConfig } from "@/firebase/server/pricing";

export async function getBillingInsights(userId: string) {
  const pricing = await getPricingConfig();
  const usageDoc = await adminDb.collection("usage").doc(userId).get();
  const usage = usageDoc.data() ?? {};
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const user = userDoc.data() ?? {};

  const projectedReports = (usage.reportsThisMonth ?? 0) * 2;

  return {
    projectedReports,
    recommendation:
      projectedReports > pricing.plans.landlordPremium.monthlyReports
        ? "Upgrade to Premium to reduce overage charges."
        : "Your current plan matches your usage.",
    estimatedOverage:
      projectedReports * pricing.fullReport,
    creditBurnRate: (usage.searchesToday ?? 0) + (usage.reportsThisMonth ?? 0),
  };
}
