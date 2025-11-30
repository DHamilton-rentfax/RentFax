import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { renterId, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report?r=${renterId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
    line_items: [{ price: process.env.REPORT_PRICE_ID!, quantity: 1 }],
    metadata: { renterId, userId, type: "full-report" },
  });

  return NextResponse.json({ url: session.url });
}
