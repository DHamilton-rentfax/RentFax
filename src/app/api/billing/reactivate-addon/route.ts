import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authAdmin, dbAdmin } from "@@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { addonId } = await req.json();
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await authAdmin.verifyIdToken(token);

    const companyId = (decoded as any).companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "User not associated with a company." },
        { status: 400 },
      );
    }

    const companyDoc = await dbAdmin
      .collection("companies")
      .doc(companyId)
      .get();
    const stripeCustomerId = companyDoc.data()?.stripe?.customer;
    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for this company." },
        { status: 400 },
      );
    }

    const billingCycle = "monthly"; // default (or detect user preference)
    const addonPriceKey = `${addonId}_${billingCycle}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: addonPriceKey,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        uid: decoded.uid,
        companyId: companyId,
        type: "addon_reactivate",
        addonId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Reactivate addon error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
