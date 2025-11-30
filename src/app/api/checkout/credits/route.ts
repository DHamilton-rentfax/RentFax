import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 1000, // $10 for 10 credits
          product_data: {
            name: "RentFAX Credits",
            description: "Prepaid credits for identity checks & full reports",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { userId, type: "CREDITS" },
    success_url: `${process.env.APP_URL}/dashboard?credits_success=1`,
    cancel_url: `${process.env.APP_URL}/dashboard?credits_cancel=1`,
  });

  return NextResponse.json({ url: session.url });
}
