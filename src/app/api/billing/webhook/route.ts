// src/app/api/billing/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  let event;
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const renterId = session.success_url?.split("renter=")[1];

    if (!renterId) return NextResponse.json({ ok: true });

    const priceKey = session.metadata?.lookup_key;

    // map lookup key → credit type
    const creditType =
      priceKey === "identity_check_single"
        ? "identity_check"
        : "full_report";

    // give user credits
    await adminDb.collection("users").doc(renterId).update({
      creditsAvailable: FieldValue.increment(1),
    });

    await adminDb.collection("billing_logs").add({
      uid: renterId,
      type: creditType,
      stripeSessionId: session.id,
      createdAt: Date.now(),
    });
  }

  return NextResponse.json({ received: true });
}