"use server";

import { adminDb } from "@/firebase/server";
import { getPricingConfig } from "@/firebase/server/pricing";

export async function getBillingForecast(userId: string) {
  const usageSnap = await adminDb.collection("usage").doc(userId).get();
  const pricing = await getPricingConfig();

  const usage = usageSnap.data() || {};

  // Past 30 days growth rate
  const daily = usage.daily || {};
  const days = Object.keys(daily).length;

  let totalSearches = 0;
  let totalReports = 0;

  for (const date in daily) {
    totalSearches += daily[date].searches || 0;
    totalReports += daily[date].reports || 0;
  }

  const avgSearches = days ? totalSearches / days : 0;
  const avgReports = days ? totalReports / days : 0;

  // Forecast for next 30 days
  const projectedSearches = Math.round(avgSearches * 30);
  const projectedReports = Math.round(avgReports * 30);

  const searchCost = projectedSearches * pricing.identityCheck;
  const reportOverageCost =
    projectedReports > pricing.plans.landlordPremium.monthlyReports
      ? (projectedReports - pricing.plans.landlordPremium.monthlyReports) *
        pricing.plans.landlordPremium.overage
      : 0;

  const projectedBill = searchCost + reportOverageCost;

  const recommendation =
    projectedBill > 29
      ? "Upgrade to Premium — usage forecast suggests cost savings."
      : "Your current plan matches your projected usage.";

  return {
    avgSearches,
    avgReports,
    projectedSearches,
    projectedReports,
    projectedBill,
    recommendation,
  };
}
