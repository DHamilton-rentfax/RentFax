"use server";

import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
const stripe = new Stripe(stripeSecret);

export async function createPortalSession(userId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  // 1. Get user from Firestore
  const snap = await adminDb.collection("users").doc(userId).get();
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
