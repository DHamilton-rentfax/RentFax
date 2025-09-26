import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// ✅ Use lookup keys for safety
export async function POST(req: Request) {
  try {
    const { plan, addons, billing } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "No plan selected" }, { status: 400 });
    }

    // Plan lookup
    const planKey = plan; // ex: "plan_standard_monthly"
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: planKey, quantity: 1 },
    ];

    // Add-ons lookup
    if (addons && Array.isArray(addons)) {
      addons.forEach((addon: string) => {
        const addonKey =
          billing === "annual" ? `${addon}_annual` : `${addon}_monthly`;
        line_items.push({ price: addonKey, quantity: 1 });
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
