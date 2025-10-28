// ===========================================
// RentFAX | Stripe Webhook Handler
// Location: src/app/api/stripe/webhooks/route.ts
// ===========================================
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase/server";
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";

// Secret key & webhook secret stored in .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const { userId, renterId, intentId, type, email } = metadata;

    try {
      if (type === "basic" || type === "reverify") {
        // $4.99 ID verification purchase
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/report/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: metadata.name,
              email,
              phone: metadata.phone,
              address: metadata.address,
              renterId,
              userId,
            }),
          }
        );
      } else if (type === "full") {
        // $20 full report purchase
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/report/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              renterId,
              userId,
              intentId,
              email,
            }),
          }
        );
      }

      // Log every Stripe transaction
      await addDoc(collection(db, "paymentLogs"), {
        stripeId: session.id,
        userId,
        renterId: renterId || null,
        type,
        amount: session.amount_total! / 100,
        email,
        createdAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
