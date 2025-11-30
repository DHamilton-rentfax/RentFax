import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";
import { doc, updateDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const { reportId, renterId, userId } = await req.json();

  if (!reportId || !renterId || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Full Renter Report",
            description: `Report for renter ${renterId}`,
          },
          unit_amount: 2000, // $20
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportId}?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${reportId}?canceled=1`,

    metadata: { reportId, renterId, userId },
  });

  return NextResponse.json({ url: session.url });
}
