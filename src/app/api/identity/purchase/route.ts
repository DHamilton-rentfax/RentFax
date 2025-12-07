// src/app/api/identity/purchase/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getCompanyPlanContextFromUid } from "@/lib/billing/company-plan";
import { recordUsageEvent } from "@/lib/billing/usage";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renter, searchSessionId, requesterUid } = body;

    if (!requesterUid) {
      return NextResponse.json(
        { error: "Missing requesterUid." },
        { status: 400 }
      );
    }

    if (!renter?.fullName) {
      return NextResponse.json(
        { error: "Missing renter information." },
        { status: 400 }
      );
    }

    // 1) Resolve company + plan
    const ctx = await getCompanyPlanContextFromUid(requesterUid);

    // 2) Enforce identityCheck usage/limits
    const usageResult = await recordUsageEvent({
      companyId: ctx.companyId,
      planId: ctx.planId,
      type: "identityCheck",
    });

    if (!usageResult.allowed) {
      return NextResponse.json(
        {
          error:
            usageResult.reason ||
            "Your plan has reached the daily identity check limit.",
        },
        { status: 402 }
      );
    }

    // 3) Load live pricing from admin/globalControls (if present)
    const globalSnap = await adminDb.collection("admin").doc("globalControls").get();
    const globalData = globalSnap.exists ? globalSnap.data() || {} : {};
    const pricing = globalData.pricing || {};

    const identityPrice =
      typeof pricing.identityCheckPrice === "number"
        ? pricing.identityCheckPrice
        : 4.99;

    // Amount in cents
    const amountCents = Math.round(identityPrice * 100);

    // 4) Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "RentFAX Identity Check",
              description: `Identity verification for ${renter.fullName}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        companyId: ctx.companyId,
        planId: ctx.planId,
        searchSessionId: searchSessionId || "",
        renterName: renter.fullName,
        renterEmail: renter.email || "",
        renterPhone: renter.phone || "",
        usageType: "identityCheck",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/cancel`,
    });
    
    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Identity purchase error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to start identity check." },
      { status: 500 }
    );
  }
}
