import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getPricingConfig } from "@/firebase/server/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const { userId, searchPayload } = await req.json();
  const pricing = await getPricingConfig();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "RentFAX Identity Check",
            description: "Identity verification for screening",
          },
          unit_amount: Math.round(pricing.identityCheck * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      type: "IDENTITY_CHECK",
      searchPayload: JSON.stringify(searchPayload),
    },
    success_url: `${process.env.APP_URL}/search/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/search/canceled`,
  });

  return NextResponse.json({ url: session.url });
}
