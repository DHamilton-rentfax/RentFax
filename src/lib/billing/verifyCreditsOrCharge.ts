import { adminDb } from "@/firebase/server";
import { createCheckoutSession } from "@/firebase/server-actions/stripe";

export async function verifyCreditsOrCharge({
  uid,
  requiredCredits,
  description,
}: {
  uid: string;
  requiredCredits: number;
  description: string;
}) {
  const userRef = adminDb.collection("users").doc(uid);
  const snap = await userRef.get();
  const user = snap.data();

  if (!user) throw new Error("User not found");

  const credits = user.credits ?? 0;

  // If enough credits, deduct and allow
  if (credits >= requiredCredits) {
    await userRef.update({
      credits: credits - requiredCredits,
    });
    return { allowed: true };
  }

  // Otherwise charge user (redirect to Stripe)
  const session = await createCheckoutSession({
    uid,
    amount: requiredCredits,
    description,
  });

  return {
    allowed: false,
    checkoutUrl: session.url,
  };
}
