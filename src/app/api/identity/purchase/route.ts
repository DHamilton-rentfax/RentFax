import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, renterId, renterData } = await req.json();

    if (!userId || !renterData) {
      return NextResponse.json(
        { error: "Missing userId or renterData." },
        { status: 400 }
      );
    }

    const priceId = process.env.IDENTITY_CHECK_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing IDENTITY_CHECK_PRICE_ID in environment." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        renterId: renterId || "",
        type: "identity-check",
      },
      success_url: `https://rentfax.io/verify?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://rentfax.io/dashboard`,
    });

    // Log purchase
    await adminDb
      .collection("identity_purchases")
      .doc(session.id)
      .set({
        userId,
        renterId: renterId || null,
        renterData,
        sessionId: session.id,
        createdAt: Date.now(),
        status: "pending",
      });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("IDENTITY PURCHASE ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to start identity purchase." },
      { status: 500 }
    );
  }
}
