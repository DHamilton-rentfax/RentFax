import Stripe from "stripe";
import { PRICE_MAP } from "./price-map";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function recordStripeUsage(
  subscriptionItemId: string,
  event: string,
  amount: number
) {
  const priceId = PRICE_MAP[event];
  if (!priceId) return;

  try {
    await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity: amount,
        timestamp: Math.floor(Date.now() / 1000),
        action: "increment",
      }
    );
  } catch (err) {
    console.error("❌ Stripe usage record failed", err);
  }
}
