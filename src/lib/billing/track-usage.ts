import { adminDb } from "@/firebase/server";
import type { UsageEvent } from "./usage-types";
import { recordStripeUsage } from "./stripe-usage";

export async function trackUsage(
  companyId: string,
  event: UsageEvent,
  amount: number = 1
) {
  if (!companyId) return;

  const today = new Date().toISOString().slice(0, 10);

  // Write to Firestore
  const ref = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsage")
    .doc(today);

  await ref.set(
    {
      date: today,
      [event]: adminDb.FieldValue.increment(amount),
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  // Write to historic logs
  await adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingUsageHistory")
    .add({
      event,
      amount,
      timestamp: Date.now(),
      date: today,
    });

  // Stripe metered billing
  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const subItems = companyDoc.get("subscription.items");

  if (subItems && subItems[event]) {
    await recordStripeUsage(subItems[event], event, amount);
  }
}
