import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { type, renterId, email } = await req.json();

    const priceId =
      type === "basic"
        ? process.env.STRIPE_PRICE_VERIFY_499
        : process.env.STRIPE_PRICE_REPORT_20;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/success?renterId=${renterId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: { renterId, type },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
