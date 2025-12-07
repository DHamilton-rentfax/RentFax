
import { adminDb } from "@/firebase/server";
import dayjs from "dayjs";

export async function refreshIdentityCredits(companyId: string, plan: string) {
  const ref = adminDb.collection("companies").doc(companyId);
  const snap = await ref.get();
  const data = snap.data();

  const now = dayjs();
  const lastReset = data?.identityCreditsResetAt
    ? dayjs(data.identityCreditsResetAt.toDate()) // Timestamps may be objects
    : null;

  // Helper to get credits by plan
  const getCreditsForPlan = (p: string) => {
    switch (p) {
      case "starter":
        return 5;
      case "pro":
        return 20;
      case "enterprise":
        return 999999; // Represents unlimited
      default:
        return 0;
    }
  };

  // Reset if missing or if it's a new month
  if (!lastReset || !now.isSame(lastReset, "month")) {
    const credits = getCreditsForPlan(plan);

    return ref.update({
      identityCredits: credits,
      identityCreditsUsedThisMonth: 0,
      identityCreditsResetAt: now.toDate(),
    });
  }
}

export async function useIdentityCredit(companyId: string, plan: string, role?: string) {
  const ref = adminDb.collection("companies").doc(companyId);
  const snap = await ref.get();
  const company = snap.data();

  if (!company) throw new Error("Company not found");

  // SUPER ADMIN has unlimited credits
  if (role === "SUPER_ADMIN") return true;

  // Enterprise plan has unlimited credits
  if (plan === "enterprise") return true;

  const used = company.identityCreditsUsedThisMonth || 0;
  const limit = company.identityCredits || 0;

  if (used >= limit) return false;

  await ref.update({
    identityCreditsUsedThisMonth: used + 1,
  });

  return true;
}
