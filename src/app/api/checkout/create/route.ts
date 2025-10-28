// ===========================================
// RentFAX | Create Checkout Session
// Location: src/app/api/checkout/create/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { doc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const PRICE_ID_BASIC = process.env.STRIPE_PRICE_ID_BASIC!;
const PRICE_ID_FULL = process.env.STRIPE_PRICE_ID_FULL!;
const PRICE_ID_REVERIFY = process.env.STRIPE_PRICE_ID_REVERIFY!;

export async function POST(req: Request) {
  try {
    const { intentId, type, userId } = await req.json();

    if (!intentId || !type || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const intentRef = doc(db, "reportIntents", intentId);
    const intentSnap = await getDoc(intentRef);

    if (!intentSnap.exists()) {
      return NextResponse.json({ error: "Invalid intent" }, { status: 404 });
    }

    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    switch (type) {
      case 'basic':
        line_items.push({ price: PRICE_ID_BASIC, quantity: 1 });
        break;
      case 'full':
        line_items.push({ price: PRICE_ID_FULL, quantity: 1 });
        break;
      case 'reverify_and_full':
        line_items.push(
          { price: PRICE_ID_REVERIFY, quantity: 1 },
          { price: PRICE_ID_FULL, quantity: 1 }
        );
        break;
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?report_created=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        userId,
        intentId,
        type,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
