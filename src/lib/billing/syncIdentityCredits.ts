import { adminDb } from "@/firebase/server";
import { getPlanIdentityCredits } from "./identity-credits";

export async function syncIdentityCredits(uid: string, plan: string) {
  const monthlyCredits = getPlanIdentityCredits(plan);
  const now = Date.now();
  const nextCycle = now + 30 * 24 * 60 * 60 * 1000; // temp: replace later with Stripe period

  const ref = adminDb
    .collection("users")
    .doc(uid)
    .collection("billing")
    .doc("identityCredits");

  const snap = await ref.get();
  const exists = snap.exists;

  if (!exists) {
    await ref.set({
      plan,
      monthlyCredits,
      creditsUsed: 0,
      creditsRemaining: monthlyCredits,
      periodStart: now,
      periodEnd: nextCycle,
      autoReset: true,
      updatedAt: now,
    });
  } else {
    await ref.update({
      plan,
      monthlyCredits,
      creditsUsed: 0,
      creditsRemaining: monthlyCredits,
      periodStart: now,
      periodEnd: nextCycle,
      updatedAt: now,
    });
  }

  return true;
}
