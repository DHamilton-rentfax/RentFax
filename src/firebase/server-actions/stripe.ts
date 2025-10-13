"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

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
