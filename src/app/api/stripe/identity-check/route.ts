import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getAdminDb } from "@/firebase/server";


export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { renterId, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Identity Check" },
          unit_amount: 499,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/success?type=identity-check`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    metadata: { userId, renterId, type: "identityCheck" },
  });

  return NextResponse.json({ sessionId: session.id });
}
