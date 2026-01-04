import { adminDb } from "@/firebase/server";

export async function requireCredits(
  orgId: string,
  amount = 1
) {
  const ref = adminDb.collection("orgs").doc(orgId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("ORG_NOT_FOUND");
  }

  const data = snap.data()!;
  const credits = Number(data.creditsRemaining ?? 0);

  if (credits < amount) {
    throw new Error("NO_CREDITS");
  }

  return true;
}
