import { adminDb } from "@/firebase/server";

export async function syncStripeCheckoutToFirestore(session: any) {
  const email = session.customer_details?.email;
  if (!email) throw new Error("Missing customer email.");

  const userRef = adminDb.collection("users").doc(email);
  const data = {
    plan: session.metadata?.plan || "custom",
    addOns: session.metadata?.addOns
      ? JSON.parse(session.metadata.addOns)
      : [],
    amountPaid: session.amount_total / 100,
    currency: session.currency,
    status: session.payment_status,
    lastPaymentAt: new Date(),
    stripeSessionId: session.id,
  };

  await userRef.set(
    {
      billing: data,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  console.log("✅ Synced Stripe Checkout to Firestore for:", email);
}
