"use server";

import Stripe from "stripe";
import { adminDB } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function createPortalSession(userId: string) {
  // 1. Get user from Firestore
  const snap = await adminDB.collection("users").doc(userId).get();
  if (!snap.exists) throw new Error("User not found");

  const user = snap.data()!;
  const customerId = user.stripeCustomerId;

  if (!customerId) {
    throw new Error("No Stripe customer associated with user");
  }

  // 2. Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.APP_URL}/dashboard`,
  });

  return session.url;
}
