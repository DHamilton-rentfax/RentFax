import { adminDb } from "@/firebase/server";

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { authUser } from "@/lib/authUser"; // Assuming you have this helper
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

const getStripeCustomerId = async (email: string, userId?: string): Promise<string> => {
    if (userId) {
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (userDoc.exists && userDoc.data()?.stripeCustomerId) {
            return userDoc.data()?.stripeCustomerId;
        }
    }

    // Check if a customer with this email already exists
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length > 0) {
        return customers.data[0].id;
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({ email });
    if (userId) {
        await adminDb.collection('users').doc(userId).set({ stripeCustomerId: customer.id }, { merge: true });
    }
    return customer.id;
};

export async function POST(req: NextRequest) {
  try {
    const { type, email, renterId, renterData } = await req.json();
    const user = await authUser(req).catch(() => null); // Allow anonymous users

    let priceId = '';
    const metadata: Stripe.MetadataParam = { type };

    if (type === 'full' && renterId) {
      // Price ID for the $20 Full Report
      priceId = process.env.STRIPE_PRICE_ID_FULL_REPORT || 'price_1PQ3dJAbK2S36ClWvISf4biy'; 
      metadata.renterId = renterId;
    } else if (type === 'basic') {
      // Price ID for the $4.99 Basic Lookup
      priceId = process.env.STRIPE_PRICE_ID_BASIC_LOOKUP || 'price_1PQ3dJAbK2S36ClWvISf4biy'; 
      metadata.renterData = JSON.stringify(renterData);
    } else {
      return NextResponse.json({ error: 'Invalid purchase type' }, { status: 400 });
    }

    const customerId = await getStripeCustomerId(email, user?.uid);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      customer: customerId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${renterId || 'new'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
