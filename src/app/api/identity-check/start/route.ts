import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { renterId, searchId, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify-success?r=${renterId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
    line_items: [{ price: process.env.IDENTITY_CHECK_PRICE_ID!, quantity: 1 }],
    metadata: { renterId, searchId, userId, type: "identity-check" },
  });

  return NextResponse.json({ url: session.url });
}
