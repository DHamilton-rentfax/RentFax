// src/app/api/billing/full-report/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const { renterId } = await req.json();

  if (!renterId) {
    return NextResponse.json({ error: "Missing renterId" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: "full_report_single", // lookup key
        quantity: 1,
      },
    ],
    success_url: `${process.env.BASE_URL}/verification/success?renter=${renterId}`,
    cancel_url: `${process.env.BASE_URL}/verification/cancel`,
  });

  return NextResponse.json({ url: session.url });
}