import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_REPORT,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?report=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    metadata: { type: "report" },
  });

  return NextResponse.json({ url: session.url });
}