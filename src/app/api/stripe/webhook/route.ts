import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/server/firebase-admin";
import { provisionPdplVerification } from "@/lib/verification/provisionPdplVerification";

/* -------------------------------------------------------------------------- */
/* STRIPE INIT                                                                 */
/* -------------------------------------------------------------------------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

/* -------------------------------------------------------------------------- */
/* WEBHOOK HANDLER                                                             */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  /* ------------------------------------------------------------------------ */
  /* IDEMPOTENCY CHECK                                                         */
  /* ------------------------------------------------------------------------ */
  const eventRef = adminDb.collection("stripe_events").doc(event.id);
  const existing = await eventRef.get();

  if (existing.exists) {
    // Already processed
    return NextResponse.json({ received: true });
  }

  /* Persist event receipt immediately */
  await eventRef.set({
    type: event.type,
    created: event.created,
    livemode: event.livemode,
    receivedAt: new Date(),
  });

  /* ------------------------------------------------------------------------ */
  /* EVENT HANDLING                                                            */
  /* ------------------------------------------------------------------------ */
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata) {
    await eventRef.update({
      status: "ignored_missing_metadata",
    });
    return NextResponse.json({ received: true });
  }

  const {
    intentId,
    renterId,
    orgId,
    type,
  } = session.metadata;

  if (!intentId || !orgId || !type) {
    await eventRef.update({
      status: "ignored_invalid_metadata",
      metadata: session.metadata,
    });
    return NextResponse.json({ received: true });
  }

  /* ------------------------------------------------------------------------ */
  /* TRANSACTIONAL PROCESSING                                                  */
  /* ------------------------------------------------------------------------ */
  await adminDb.runTransaction(async (tx) => {
    const intentRef = adminDb
      .collection("payment_intents")
      .doc(intentId);

    const intentSnap = await tx.get(intentRef);

    if (!intentSnap.exists) {
      throw new Error(`Payment intent ${intentId} not found`);
    }

    const intent = intentSnap.data()!;

    if (intent.status === "paid") {
      return;
    }

    tx.update(intentRef, {
      status: "paid",
      stripeSessionId: session.id,
      paidAt: new Date(),
    });

    if (type === "PDPL_VERIFICATION") {
      if (!renterId) {
        throw new Error("Missing renterId for PDPL verification");
      }

      await provisionPdplVerification({
        renterId,
        orgId,
        intentId,
      });
    }

    // PAYG_REPORT requires no backend action beyond marking paid
  });

  await eventRef.update({
    status: "processed",
  });

  return NextResponse.json({ received: true });
}
