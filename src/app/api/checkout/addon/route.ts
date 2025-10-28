
// /src/app/api/checkout/addon/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/firebase/server"; // Assuming you have server-side auth utility

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

const ADDON_PRICES: Record<string, string> = {
    '50': process.env.STRIPE_PRICE_BUNDLE_50 || 'price_bundle_50',
    '100': process.env.STRIPE_PRICE_BUNDLE_100 || 'price_bundle_100',
    'custom': process.env.STRIPE_PRICE_BUNDLE_CUSTOM || 'price_bundle_custom',
};

export async function POST(req: Request) {
  try {
    const { credits, customQuantity } = await req.json();
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    let priceId;
    let quantity = 1;

    if (credits === 'custom' && customQuantity) {
        priceId = ADDON_PRICES.custom;
        quantity = customQuantity;
    } else {
        priceId = ADDON_PRICES[credits];
    }

    if (!priceId) {
        return NextResponse.json({ error: "Invalid credit bundle" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits_purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: { 
          type: 'addon',
          credits: credits === 'custom' ? customQuantity : credits,
          userId
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe addon session error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
