
import { adminDb } from "@/firebase/server";
import { getCompanyPlanLimits } from "./plan-limits";

export async function enforceUsage(companyId: string, action: string) {
  const limits = await getCompanyPlanLimits(companyId);
  const todayRef = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsage")
    .doc("today");

  const today = (await todayRef.get()).data() || {};

  const currentCount = today[action] || 0;
  const limit = limits[action];

  // Unlimited
  if (limit === -1) return true;

  if (currentCount >= limit) {
    return false;
  }

  return true;
}
