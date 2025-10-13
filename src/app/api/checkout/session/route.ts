import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0)
      return NextResponse.json(
        { error: "No items provided." },
        { status: 400 },
      );

    const lineItems = items.map((item: any) => ({
      price_data: {
        // Changed from 'price' to 'price_data' for ad-hoc items
        currency: "usd",
        product_data: {
          name: item.lookup_key, // Use lookup_key as product name
        },
        unit_amount: item.price * 100, // Price in cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
