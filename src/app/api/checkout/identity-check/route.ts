import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renterName, renterEmail, renterPhone, searchSessionId } = body;

    // Get authenticated user (server-side middleware sets req.userId)
    const userId = body.userId; 
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user already has verification credits
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const userData = userSnap.data() || {};
    const credits = userData.identityCredits ?? 0;

    // If they have credits, decrement and return success
    if (credits > 0) {
      await adminDb.collection("users").doc(userId).update({
        identityCredits: credits - 1,
      });

      // Store the request for tracking
      const requestRef = await adminDb.collection("identityRequests").add({
        renterName,
        renterEmail,
        renterPhone,
        searchSessionId,
        userId,
        createdAt: Date.now(),
        status: "PAID_PENDING_SEND",
      });

      return NextResponse.json({
        ok: true,
        requestId: requestRef.id,
      });
    }

    // Otherwise start Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_IDENTITY_CHECK, // price_XXXX
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        renterName,
        renterEmail,
        renterPhone,
        searchSessionId,
        type: "identity-check",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/search?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/search?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Identity checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
