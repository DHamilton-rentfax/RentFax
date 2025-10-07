import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { lookup_key, renterInfo } = await request.json();

  if (!lookup_key || !renterInfo) {
    return NextResponse.json({ error: "Missing lookup_key or renterInfo" }, { status: 400 });
  }

  try {
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ["data.product"],
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${renterInfo}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/screen?canceled=true`,
      metadata: {
        renterInfo: renterInfo,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
  }
}
