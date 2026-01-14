Of course. We will skip that step and proceed.

The next logical step is to create the Stripe Checkout session based on the unified payment intent and then handle the webhook that Stripe sends upon successful payment. This ensures a complete and secure payment flow.

First, I will create a new API endpoint at src/app/api/payments/checkout/route.ts. This endpoint will be responsible for taking a payment_intent ID, creating a corresponding Stripe Checkout session, and returning the redirect URL to the user. This keeps the intent creation and the checkout process cleanly separated.

import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/server";
import { verifySession } from "@/lib/auth/verifySession";
import { stripe } from "@/lib/stripe/server"; // Assumes a configured Stripe client

// This should be in your environment variables
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req) {
  const session = await verifySession();
  if (!session?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { intentId } = await req.json();
  if (!intentId) {
    return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 });
  }

  try {
    const intentRef = doc(db, "payment_intents", intentId);
    const intentSnap = await getDoc(intentRef);

    if (!intentSnap.exists()) {
      return NextResponse.json({ error: "Payment Intent not found" }, { status: 404 });
    }

    const intent = intentSnap.data();

    // Security checks
    if (intent.uid !== session.uid) {
      return NextResponse.json({ error: "Forbidden: Intent does not belong to user" }, { status: 403 });
    }
    if (intent.status !== "pending") {
      return NextResponse.json({ error: "This payment intent is no longer valid." }, { status: 400 });
    }

    // Create a Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: intent.type === "PDPL" ? "Identity Verification" : "RentFAX Report",
              description: intent.type === "PDPL"
                ? "One-time public data verification check."
                : "Unlock a single RentFAX risk report.",
            },
            unit_amount: Math.round(intent.amount * 100), // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${APP_URL}/dashboard?payment_success=true&intent_id=${intentId}`,
      cancel_url: `${APP_URL}/dashboard`,
      metadata: {
        intentId: intentId,
        uid: session.uid,
        payment_type: intent.type,
      },
    });

    if (!stripeSession.url) {
        throw new Error("Failed to create Stripe session URL");
    }

    // Associate the Stripe session with our intent for webhook reconciliation
    await updateDoc(intentRef, {
      stripeSessionId: stripeSession.id,
      updatedAt: serverTimestamp(),
    });

    // Redirect user to Stripe
    return NextResponse.json({ url: stripeSession.url });

  } catch (err) {
    console.error("Stripe Checkout error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
Excellent. The Stripe Checkout session endpoint has been created.

Now, to complete the payment flow, I will create the Stripe webhook handler. This will be a new API endpoint at src/app/api/webhooks/stripe/route.ts. This endpoint will listen for incoming webhooks from Stripe, securely verify their authenticity, and then update the corresponding payment_intent in Firestore to paid upon a successful checkout.session.completed event. This is the critical step for reconciling payments and granting access to the purchased service.

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/firebase/server';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const buf = await req.text();
  const sig = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const { intentId, uid, payment_type } = session.metadata || {};

      if (!intentId) {
        console.error('Webhook received without a intentId in metadata');
        // We can't process this, but we return 200 so Stripe doesn't retry.
        return NextResponse.json({ received: true });
      }

      try {
        const intentRef = doc(db, 'payment_intents', intentId);
        await updateDoc(intentRef, {
          status: 'paid',
          stripeSessionId: session.id,
          updatedAt: serverTimestamp(),
          completedAt: serverTimestamp(), // Mark as completed
        });

        // Next step: Add logic here to provision the actual service
        // e.g., for 'PAYG_REPORT', grant access to the report.
        // for 'PDPL', create the PDPL task and notify the user.

        console.log(`Successfully processed payment for intent: ${intentId}`);

      } catch (dbError: any) {
        console.error(`Database error processing intent ${intentId}:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

Create File

Review Changes