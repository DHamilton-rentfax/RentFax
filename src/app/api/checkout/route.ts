import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email, fullName, priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing Price ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      customer_email: email, // Pre-fill the email address
      metadata: {
        fullName, // Pass full name to the metadata
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe Session Creation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
