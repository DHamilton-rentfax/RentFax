import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const PRICE_ID = "price_12345"; // Replace with your actual price ID
const PRODUCT_NAME = "Identity Check";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchId, userId } = body;

    if (!searchId || !userId) {
      return NextResponse.json({ error: "Missing searchId or userId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: PRODUCT_NAME,
            },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.get("referer") || `${req.headers.get("origin")}/`,
      metadata: {
        searchId,
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
