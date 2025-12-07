import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const { amount, renterId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Payment for Renter ${renterId}` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/renter/payments?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/renter/payments?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
