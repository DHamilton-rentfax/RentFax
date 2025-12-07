import Stripe from "stripe";
import { db } from "@/firebase/server";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const renterId = session.metadata?.renterId;
      const type = session.metadata?.type;

      if (type === "basic" && renterId) {
        // Trigger verification
        await updateDoc(doc(db, "renterReports", renterId), {
          verified: true,
          status: "verified",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
