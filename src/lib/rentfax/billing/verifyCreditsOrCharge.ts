import { adminDb } from "@/firebase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

type BillingAction = "search" | "identityCheck" | "fullReport";

const ACTION_CONFIG: Record<
  BillingAction,
  { amount: number; creditField: string }
> = {
  search: { amount: 49, creditField: "searchCredits" },           // $0.49
  identityCheck: { amount: 499, creditField: "identityCredits" }, // $4.99
  fullReport: { amount: 2000, creditField: "reportCredits" },     // $20.00
};

export async function verifyCreditsOrCharge(
  userId: string,
  action: BillingAction
) {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return { success: false, error: "User not found" };
  }

  const user = userSnap.data() || {};
  const plan = user.subscription || "free";

  const config = ACTION_CONFIG[action];
  const creditField = config.creditField;
  const currentCredits = user[creditField] || 0;

  // 1. If user has credits, consume one
  if (currentCredits > 0) {
    await userRef.update({
      [creditField]: currentCredits - 1,
    });

    return {
      success: true,
      source: "credit",
      deltaCredits: -1,
    };
  }

  // 2. Otherwise, pay-per-use via Stripe PaymentIntent
  // (Assumes the customer & default payment method already exist)
  if (!user.stripeCustomerId) {
    return {
      success: false,
      error: "No Stripe customer attached to user.",
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: config.amount,
    currency: "usd",
    customer: user.stripeCustomerId,
    confirm: true,
    off_session: true,
    metadata: {
      userId,
      action,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    success: true,
    source: "stripe_charge",
    paymentIntentId: paymentIntent.id,
    deltaCredits: 0,
  };
}
