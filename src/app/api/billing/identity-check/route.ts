
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Identity Check" },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?id=${renterId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/identity-check?renter=${renterId}`,
      metadata: { renterId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("IDENTITY CHECK BILLING ERROR:", error);
    return NextResponse.json(
      { error: "Failed to start checkout." },
      { status: 500 }
    );
  }
}
