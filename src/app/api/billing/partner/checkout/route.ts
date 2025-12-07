import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

const PLAN_KEYS: Record<string, Record<string, string>> = {
  agency: {
    starter: "price_agency_starter",
    pro: "price_agency_pro",
    enterprise: "price_agency_enterprise",
  },
  legal: {
    standard: "price_legal_standard",
    priority: "price_legal_priority",
    enterprise: "price_legal_enterprise",
  },
};

export async function POST(req: Request) {
  try {
    const { role, plan, email, uid } = await req.json();
    const priceId = PLAN_KEYS[role]?.[plan];
    if (!priceId) throw new Error("Invalid role or plan");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${role}-dashboard/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/partners/${role}/signup?canceled=true`,
      metadata: { uid, role, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
