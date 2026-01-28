import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();

    // Basic validation
    if (!body.fullName || !body.email) {
        return NextResponse.json({ found: false, error: "Full name and email are required." }, { status: 400 });
    }

    // Query for renter based on full name and email for better accuracy
    const snap = await adminDb.collection("renters")
      .where("fullName", "==", body.fullName)
      .where("email", "==", body.email)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ found: false });
    }

    const renter = snap.docs[0].data();

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_FULL_REPORT) {
        console.error("Stripe secret key or price ID is not configured.");
        return NextResponse.json({ found: false, error: "Billing is not configured." }, { status: 500 });
    }

    // Create checkout session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: "payment",
      line_items: [
        { price: process.env.STRIPE_PRICE_FULL_REPORT, quantity: 1 },
      ],
      success_url: `${process.env.APP_URL}/report/unlocked?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/report/search`,
      metadata: {
        renterId: renter.id,
        type: "public_full_report",
      }
    });

    return NextResponse.json({
      found: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Public search API error:", error);
    return NextResponse.json({ found: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
