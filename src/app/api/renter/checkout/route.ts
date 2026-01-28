import { getAdminDb } from "@/firebase/server";
// src/app/api/renter/checkout/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn("⚠ STRIPE_SECRET_KEY not set. /api/renter/checkout will fail.");
}

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-06-20",
    })
  : null;

const checkoutSchema = z.object({
  type: z.enum(["IDENTITY_CHECK", "FULL_REPORT"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional().default("US"),
  licenseNumber: z.string().optional(),
  publicProfile: z.any().optional(),
});

const IDENTITY_PRICE_ID =
  process.env.STRIPE_PRICE_ID_IDENTITY_CHECK || "";
const FULL_REPORT_PRICE_ID =
  process.env.STRIPE_PRICE_ID_FULL_REPORT || "";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = checkoutSchema.parse(body);

    const priceId =
      parsed.type === "IDENTITY_CHECK"
        ? IDENTITY_PRICE_ID
        : FULL_REPORT_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID for this checkout type." },
        { status: 500 }
      );
    }

    const app = getFirebaseAdminApp();
    

    // Create a Firestore record for this search/checkout session
    const sessionRef = adminDb.collection("searchStatus").doc();
    const searchId = sessionRef.id;

    await sessionRef.set({
      type: parsed.type,
      status: "PENDING_PAYMENT",
      createdAt: new Date(),
      renterInput: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        addressLine1: parsed.addressLine1,
        addressLine2: parsed.addressLine2,
        city: parsed.city,
        state: parsed.state,
        postalCode: parsed.postalCode,
        country: parsed.country,
        licenseNumber: parsed.licenseNumber,
      },
      publicProfile: parsed.publicProfile || null,
    });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        searchId: searchId,
        checkoutType: parsed.type,
      },
      success_url: `${origin}/search/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/search/cancelled`,
    });

    return NextResponse.json({ url: session.url, sessionId: searchId });
  } catch (err: any) {
    console.error("renter/checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
