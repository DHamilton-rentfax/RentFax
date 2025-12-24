"use server";

import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPartnerCheckout({
  partnerOrgId,
}: {
  partnerOrgId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PARTNER_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/partner/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/partner/billing`,
  });

  return { url: session.url };
}
