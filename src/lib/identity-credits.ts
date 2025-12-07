import { adminDb } from "@/firebase/server";

export async function consumeIdentityCredit(userId: string) {
  const ref = adminDb.collection("identityCredits").doc(userId);
  const doc = await ref.get();

  const credits = doc.data()?.credits || 0;

  if (credits <= 0) return false;

  await ref.update({
    credits: credits - 1,
    updatedAt: Date.now(),
  });

  return true;
}

export async function getIdentityCredits(userId: string) {
  const doc = await adminDb.collection("identityCredits").doc(userId).get();
  return doc.data()?.credits || 0;
}
