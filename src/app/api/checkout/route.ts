import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
import { authAdmin } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { planId, addons, billingCycle, isPayg } = await req.json();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await authAdmin.verifyIdToken(token);
    const user = await authAdmin.getUser(decoded.uid);


    if (!decoded.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (isPayg) {
      // Handle one-time payment for Pay-As-You-Go
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: '1 Renter Report Credit',
                description: 'Single pay-as-you-go risk report'
              },
              unit_amount: 2000, // $20.00
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        metadata: {
          uid: decoded.uid,
          credits: 1,
        },
      });
      return NextResponse.json({ url: session.url });
    }
    
    // Handle subscription
    const planLookupKey = `${planId}_${billingCycle}`;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: planLookupKey,
        quantity: 1,
      },
    ];

    if (addons && Array.isArray(addons)) {
        addons.forEach((addon: string) => {
        const addonLookupKey = `${addon}_${billingCycle}`;
        lineItems.push({
            price: addonLookupKey,
            quantity: 1,
        });
        });
    }


    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        uid: decoded.uid,
        companyId: (decoded.claims as any)?.companyId || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
