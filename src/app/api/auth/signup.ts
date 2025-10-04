import { db } from "@/firebase/server";
import Stripe from "stripe";
import * as admin from "firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, demo } = body;

  // 1. Create user in Firebase Auth
  const userRecord = await admin.auth().createUser({ email, password });

  // 2. Create Firestore user record
  await db.collection("users").doc(userRecord.uid).set({
    email,
    role: "VIEWER",
    source: demo ? "DEMO" : "SIGNUP",
    createdAt: new Date(),
  });

  // 3. If demo user, auto-create Stripe trial subscription
  if (demo) {
    const trialPrice =
      demo === "RENTER" ? "price_renter_trial" : "price_company_trial";

    const customer = await stripe.customers.create({
      email,
      metadata: {
        demoConversion: "true",
        source: demo, // "RENTER" or "COMPANY"
      },
    });

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: trialPrice }],
      trial_period_days: 14,
      metadata: {
        demoConversion: "true",
        source: demo,
        firebaseUserId: userRecord.uid,
      },
    });

    await db.collection("users").doc(userRecord.uid).update({
      stripeCustomerId: customer.id,
      plan: demo === "RENTER" ? "RENTER_TRIAL" : "COMPANY_TRIAL",
      trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      demoConversion: true,
    });
  }

  return new Response(JSON.stringify({ success: true }));
}
