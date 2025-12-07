import { adminDb } from "@/firebase/server";

export async function useIdentityCredit(uid: string) {
  const ref = adminDb
    .collection("users")
    .doc(uid)
    .collection("billing")
    .doc("identityCredits");

  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("No identity credit profile found for user.");
  }

  const data = snap.data();
  const remaining = data.creditsRemaining ?? 0;

  if (remaining <= 0) {
    return {
      allowed: false,
      reason: "NO_CREDITS",
    };
  }

  // Deduct one
  await ref.update({
    creditsUsed: (data.creditsUsed ?? 0) + 1,
    creditsRemaining: remaining - 1,
    updatedAt: Date.now(),
  });

  // Log audit
  await adminDb
    .collection("auditLogs")
    .add({
      uid,
      action: "IDENTITY_CREDIT_USED",
      timestamp: Date.now(),
      details: {
        before: remaining,
        after: remaining - 1,
      },
    });

  return {
    allowed: true,
    remaining: remaining - 1,
  };
}
