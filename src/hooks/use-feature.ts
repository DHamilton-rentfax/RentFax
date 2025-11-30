"use client";

import { useAuth } from "./use-auth";

export function useFeature(featureKey: string) {
  const { company } = useAuth();

  if (!company) return { enabled: false, plan: "free" };

  const plan = company.plan || "free";
  const addons = company.addons || {};
  const unlocked = addons[featureKey] === true;

  // Define which plan unlocks what
  const planRank = (p: string) => ["free", "starter", "pro", "enterprise"].indexOf(p);

  const featureMap: Record<string, string> = {
    aiInsights: "pro",
    qrAnalytics: "starter",
    fraudScanner: "pro",
    prioritySupport: "pro",
  };

  const requiredPlan = featureMap[featureKey] || "starter";
  const meetsPlan = planRank(plan) >= planRank(requiredPlan);

  return {
    enabled: unlocked || meetsPlan,
    plan,
    requiredPlan,
  };
}
