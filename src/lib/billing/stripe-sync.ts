
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function syncUsageToStripe(companyId: string) {
  const usageRef = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsage")
    .doc("today");

  const usage = (await usageRef.get()).data() || {};
  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const { stripeSubscriptionId } = companyDoc.data()!;

  const priceMap: any = {
    renterSearch: "price_renter_search",
    fullReport: "price_full_report",
    incidentCreate: "price_incident",
    aiRiskAnalysis: "price_ai_analysis",
    verificationAttempt: "price_verification",
  };

  for (const event in usage) {
    if (!priceMap[event] || !stripeSubscriptionId) continue;

    // Find the correct subscription item ID for this price
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, { expand: ['items'] });
    const subscriptionItem = subscription.items.data.find(item => item.price.id === priceMap[event]);

    if (subscriptionItem) {
        await stripe.subscriptionItems.createUsageRecord(
          subscriptionItem.id, // Use the subscription item ID
          {
            quantity: usage[event],
            action: "increment",
            timestamp: Math.floor(Date.now() / 1000),
          }
        );
    }
  }

  await usageRef.delete();
}
