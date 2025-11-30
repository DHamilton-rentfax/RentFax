import { adminDb } from "@/firebase/server";

export async function registerIdentityAttempt(renterId: string) {
  const ref = adminDb.collection("renters").doc(renterId);

  await ref.update({
    identityAttempts: adminDb.FieldValue.increment(1),
    lastIdentityAttemptAt: Date.now(),
  });

  const snap = await ref.get();
  return snap.data()?.identityAttempts ?? 0;
}

export function evaluateAttemptLimit(attempts: number) {
  if (attempts <= 5) return { allowed: true };

  if (attempts <= 10) {
    return {
      allowed: false,
      cooldown: true,
      message: "Too many attempts — try again in 15 minutes",
    };
  }

  return {
    allowed: false,
    lock: true,
    message: "Identity verification temporarily locked",
  };
}