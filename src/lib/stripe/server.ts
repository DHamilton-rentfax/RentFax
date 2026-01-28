// src/lib/stripe/server.ts
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(stripeSecret);
