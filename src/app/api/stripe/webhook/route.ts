// ===========================================
// RentFAX | Stripe Webhook Handler
// Location: src/app/api/stripe/webhook/route.ts
// ===========================================
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/firebase/server";
import { doc, updateDoc, addDoc, collection, Timestamp } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // ---- Handle Completed Checkout ----
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const email = metadata.email;
      const renterId = metadata.renterId;
      const type = metadata.type; // "basic" or "full"

      console.log(`✅ Checkout complete: ${type} for renter ${renterId}`);

      // Step 1: Log event
      await addDoc(collection(db, "auditLogs"), {
        type: "checkout.completed",
        amount: session.amount_total! / 100,
        email,
        renterId,
        purchaseType: type,
        timestamp: Timestamp.now(),
      });

      // Step 2: Trigger renter verification or report creation
      if (type === "basic") {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/report/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renterId, email }),
        });
      } else if (type === "full") {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/report/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renterId, email }),
        });
      }

      // Step 3: Trigger fraud detection pipeline
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fraud/detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterId }),
      });

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/fraud-insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterId }),
      });

      // Step 4: Send notification
      await addDoc(collection(db, "notifications"), {
        type: "fraudCheck",
        title: `Fraud Analysis Complete`,
        message: `Renter ${renterId} has been analyzed for fraud and AI risk.`,
        createdAt: Timestamp.now(),
        read: false,
        level: "info",
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
