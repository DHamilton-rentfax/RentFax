import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, renterId, reportId, userId } = body;

    if (!type || !userId) {
      return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
    }

    const lookupKey =
      type === 'identity-check'
        ? process.env.IDENTITY_CHECK_LOOKUP_KEY
        : type === 'full-report'
        ? process.env.REPORT_LOOKUP_KEY
        : null;

    if (!lookupKey) {
      return NextResponse.json({ error: 'Invalid type.' }, { status: 400 });
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ['data.product'],
    });

    if (prices.data.length === 0) {
      return NextResponse.json(
        { error: 'Price not found for the given lookup key.' },
        { status: 400 }
      );
    }

    const priceId = prices.data[0].id;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
      metadata: {
        userId,
        renterId: renterId ?? "",
        reportId: reportId ?? "",
        purchaseType: type,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
