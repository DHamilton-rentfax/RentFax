import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerUser } from "@/lib/auth-server";

export async function POST() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: user.stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_FULL_REPORT, // $20
        quantity: 1
      }
    ],
    success_url: `${process.env.APP_URL}/search?success=full`,
    cancel_url: `${process.env.APP_URL}/search?canceled=1`,
    metadata: {
      type: "full_report",
      userId: user.uid
    }
  });

  return NextResponse.json({ url: session.url });
}
