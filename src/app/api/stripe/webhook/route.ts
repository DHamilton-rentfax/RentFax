import Stripe from "stripe";
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "invoice.created":
      console.log("🧾 Invoice created:", event.data.object.id);
      break;

    case "invoice.finalized":
      console.log("📌 Invoice finalized with metered usage.");
      break;

    case "invoice.payment_succeeded":
      console.log("💰 Metered invoice paid.");
      break;

    case "customer.subscription.deleted":
      console.log("❌ Subscription canceled");
      // You may disable account access here
      break;
  }

  return NextResponse.json({ received: true });
}
