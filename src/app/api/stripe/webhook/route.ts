import Stripe from "stripe";
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  /* ------------------------------------------------------------------
   * RENTFAX — TRANSACTIONAL VERIFICATION
   * ------------------------------------------------------------------ */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const reportId = session.metadata?.reportId;
    const purchaserUid = session.metadata?.purchaserUid;

    if (!reportId || !purchaserUid) {
      console.warn("⚠️ Checkout completed but missing metadata", {
        reportId,
        purchaserUid,
      });
      return NextResponse.json({ received: true });
    }

    try {
      // Unlock report
      await adminDb.collection("reports").doc(reportId).update({
        unlocked: true,
        unlockedAt: Date.now(),
        paymentIntent: session.payment_intent,
        verificationMethod: "INSTANT",
      });

      // Audit trail (CRITICAL)
      await adminDb.collection("audit_logs").add({
        type: "RENTER_VERIFIED",
        reportId,
        purchaserUid,
        source: "stripe",
        amount: session.amount_total,
        currency: session.currency,
        ts: Date.now(),
      });

      console.log("✅ RentFAX report unlocked:", reportId);
    } catch (err) {
      console.error("🔥 Failed to unlock report:", err);
      return new NextResponse("Webhook processing error", { status: 500 });
    }
  }

  /* ------------------------------------------------------------------
   * SAAS / SUBSCRIPTIONS (KEEP EXISTING)
   * ------------------------------------------------------------------ */
  switch (event.type) {
    case "invoice.created":
      console.log("🧾 Invoice created:", event.data.object.id);
      break;

    case "invoice.finalized":
      console.log("📌 Invoice finalized");
      break;

    case "invoice.payment_succeeded":
      console.log("💰 Invoice paid");
      break;

    case "customer.subscription.deleted":
      console.log("❌ Subscription canceled");
      break;
  }

  return NextResponse.json({ received: true });
}
