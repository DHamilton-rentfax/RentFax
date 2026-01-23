import { adminDb } from "@/firebase/server";

export async function logBillingEvent({
  userId,
  event,
  amount = null,
  credits = null,
  metadata = {},
  stripeObjectId = null,
}: any) {
  await adminDb.collection("billingLogs").add({
    timestamp: Date.now(),
    userId,
    event,
    amount,
    credits,
    metadata,
    stripeObjectId,
  });
}
