import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/**
 * App Router configuration
 * Required to disable static optimization and ensure raw body access
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const renterId = session.metadata?.renterId;
    if (!renterId) {
      return NextResponse.json({ received: true });
    }

    const creditType =
      session.metadata?.lookup_key === "identity_check_single"
        ? "identity_check"
        : "full_report";

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