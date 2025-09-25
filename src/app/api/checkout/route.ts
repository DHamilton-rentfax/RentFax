import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// ----------------- Stripe Price Lookup -----------------
// Replace these placeholder IDs with real Price IDs from your Stripe dashboard.
const PRICE_LOOKUP: Record<string, string> = {
  // ----- Core Plans -----
  plan_payg: "price_1PBt5kRxp9fu9vP6L00A4921",          // Pay As You Go $20/report (one-time)
  plan_standard: "price_1PBt6HRxp9fu9vP6Tf2k93sF",      // Standard $149/mo (50 reports)
  plan_pro: "price_1PBt6gRxp9fu9vP6Xy33kS80",           // Pro $299/mo unlimited
  plan_enterprise: "price_1PBt74Rxp9fu9vP6B7a3Bf5k",    // Enterprise (Contact sales – handled manually)

  // ----- Add-Ons -----
  addon_ai_risk_reports_monthly: "price_1PBtAQRxp9fu9vP6E1N535eM",
  addon_ai_risk_reports_annual: "price_1PBtAQRxp9fu9vP64oAKk3bY",
  addon_collections_monthly: "price_1PBtAlRxp9fu9vP6uaP0T4s9",
  addon_collections_annual: "price_1PBtAlRxp9fu9vP6063r8qUi",
  addon_court_filing_monthly: "price_1PBtBBRxp9fu9vP6aV0kF5l1",
  addon_court_filing_annual: "price_1PBtBBRxp9fu9vP6N9tV2fLz",
  addon_notifications_monthly: "price_1PBtBaRxp9fu9vP64h7Ea8s5",
  addon_notifications_annual: "price_1PBtBaRxp9fu9vP6yH3aC6fK",
  // ... add all other add-ons here
};

export async function POST(req: Request) {
  try {
    const { plan, addons, billing } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "No plan selected" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Core Plan
    const planKey = `plan_${plan}`;
    const planPriceId = PRICE_LOOKUP[planKey];
    if (!planPriceId) {
      throw new Error(`Missing Stripe price for ${planKey}`);
    }

    line_items.push({ price: planPriceId, quantity: 1 });

    // Add-Ons
    if (addons && Array.isArray(addons)) {
      addons.forEach((addon: string) => {
        const addonKey = `${addon}_${billing}`;
        const addonPriceId = PRICE_LOOKUP[addonKey];
        if (!addonPriceId) {
          throw new Error(`Missing Stripe price for ${addonKey}`);
        }
        line_items.push({ price: addonPriceId, quantity: 1 });
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}