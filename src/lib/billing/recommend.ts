import { forecastUsage } from "./forecast";
import { PLAN_LIMITS } from "./limits";

export function generatePlanRecommendation(plan: string, usage: any) {
  const limits = PLAN_LIMITS[plan];
  const daysIntoMonth = new Date().getDate();

  const warnings: any[] = [];
  const recommendations: any[] = [];
  let shouldUpgrade = false;

  for (const event in usage) {
    const used = usage[event];
    const limit = limits[event] ?? Infinity;

    const f = forecastUsage(used, limit, daysIntoMonth);

    // Soft warning (50% used)
    if (f.percentUsed >= 50 && f.percentUsed < 100) {
      warnings.push({
        event,
        percent: f.percentUsed,
        message: `You have used ${f.percentUsed}% of your ${event} limit.`,
      });
    }

    // Forecast hitting limit
    if (f.willExceed) {
      shouldUpgrade = true;
      recommendations.push({
        event,
        projected: f.projected,
        limit,
        message: `You are projected to exceed your ${event} limit this month.`,
      });
    }
  }

  return {
    shouldUpgrade,
    warnings,
    recommendations,
  };
}
