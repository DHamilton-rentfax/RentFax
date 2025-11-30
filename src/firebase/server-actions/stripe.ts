"use server";

import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession({ uid, amount, description }: {uid: string, amount: number, description: string}) {
  // Convert credits → price
  const priceInCents = amount * 100;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: priceInCents,
          product_data: { name: description },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    metadata: { uid, type: "CREDIT_PURCHASE" },
  });

  return { url: session.url };
}

export async function createPortalSession(customerId: string) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.NEXT_PUBLIC_APP_URL + "/admin/subscriptions",
  });

  return session;
}
