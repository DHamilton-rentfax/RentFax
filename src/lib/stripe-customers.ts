import { dbAdmin } from "@/lib/firebase-admin";

export async function getStripeCustomerId(uid: string): Promise<string> {
  const snap = await dbAdmin.doc(`users/${uid}`).get();
  if (!snap.exists) {
    throw new Error("User not found");
  }
  const stripeCustomerId = snap.get("stripeCustomerId");
  if (!stripeCustomerId) {
    throw new Error("Stripe customer ID not found for user");
  }
  return stripeCustomerId;
}
