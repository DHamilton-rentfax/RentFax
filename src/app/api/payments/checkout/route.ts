import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie";
import { stripe } from "@/lib/stripe/server"; // Assumes a configured Stripe client

// This should be in your environment variables
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const user = await getUserFromSessionCookie(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { intentId } = await req.json();
  if (!intentId) {
    return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 });
  }

  try {
    const intentRef = doc(adminDb, "payment_intents", intentId);
    const intentSnap = await getDoc(intentRef);

    if (!intentSnap.exists()) {
      return NextResponse.json({ error: "Payment Intent not found" }, { status: 404 });
    }

    const intent = intentSnap.data();

    // Security checks
    if (intent.uid !== user.uid) {
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
        uid: user.uid,
        payment_type: intent.type,
      },
    });

    if (!stripeSession.url) {
        throw new Error("Failed to create Stripe session URL");
    }

    // Associate the Stripe session with our intent for webhook reconciliation
    await updateDoc(intentRef, {
      stripeSessionId: stripeSession.id,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Redirect user to Stripe
    return NextResponse.json({ url: stripeSession.url });

  } catch (err) {
    console.error("Stripe Checkout error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
