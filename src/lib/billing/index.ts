import { adminDB } from "@/firebase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/** Load dynamic pricing (super admin can modify anytime) */
export async function getPricing() {
  const snap = await adminDB.collection("billing_config").doc("pricing").get();
  return snap.exists ? snap.data() : {};
}

/** Load a user's active billing plan */
export async function getUserPlan(userId: string) {
  const snap = await adminDB.collection("billing_plans").doc(userId).get();
  return snap.exists
    ? snap.data()
    : {
        plan: "PAY_GO",
        reportCredits: 0,
        reportsUsedThisMonth: 0,
      };
}

/** Save billing usage or monthly counters */
export async function updatePlan(userId: string, data: any) {
  return adminDB.collection("billing_plans").doc(userId).set(data, { merge: true });
}

/** Record a billing transaction (audit log) */
export async function logTransaction(userId: string, entry: any) {
  return adminDB
    .collection("billing_history")
    .doc(userId)
    .collection("transactions")
    .add({
      ...entry,
      timestamp: Date.now(),
    });
}

/** Charge user via Stripe (only for pay-as-you-go) */
export async function chargeStripe(customerId: string, amount: number, description: string) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    customer: customerId,
    description,
    automatic_payment_methods: { enabled: true }
  });
}
