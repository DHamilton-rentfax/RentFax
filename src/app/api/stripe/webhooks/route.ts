import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";
import { adminDB } from "@/firebase/server";

export const config = {
  api: { bodyParser: false }, // Required for Stripe webhooks
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const buf = await req.arrayBuffer();
    const sig = req.headers.get("stripe-signature")!;

    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ✅ New subscription created or plan changed
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user/org in Firestore (assumes you saved customerId at signup)
        const userSnap = await adminDB
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userRef = userSnap.docs[0].ref;

          // Extract active plan + add-ons
          const planPriceId = subscription.items.data[0].price.id;
          const addons = subscription.items.data
            .slice(1)
            .map((item) => item.price.lookup_key);

          await userRef.update({
            plan: planPriceId,
            addons,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: subscription.current_period_end * 1000,
            updatedAt: new Date(),
          });

          // Audit log
          await adminDB.collection("auditLogs").add({
            userId: userRef.id,
            type: "SUBSCRIPTION_UPDATED",
            details: { planPriceId, addons },
            timestamp: new Date(),
          });
        }
        break;
      }

      // ✅ Subscription canceled
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const userSnap = await adminDB
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userRef = userSnap.docs[0].ref;
          await userRef.update({
            plan: "canceled",
            addons: [],
            subscriptionStatus: "canceled",
            updatedAt: new Date(),
          });

          await adminDB.collection("auditLogs").add({
            userId: userRef.id,
            type: "SUBSCRIPTION_CANCELED",
            timestamp: new Date(),
          });
        }
        break;
      }

      // ✅ One-time payment (Pay As You Go reports)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "payment") {
          const customerId = session.customer as string;

          const userSnap = await adminDB
            .collection("users")
            .where("stripeCustomerId", "==", customerId)
            .limit(1)
            .get();

          if (!userSnap.empty) {
            const userRef = userSnap.docs[0].ref;
            await userRef.update({
              credits: (userSnap.docs[0].get("credits") || 0) + 1, // 1 report per $20 payment
              updatedAt: new Date(),
            });

            await adminDB.collection("auditLogs").add({
              userId: userRef.id,
              type: "CREDIT_PURCHASED",
              amount: session.amount_total,
              timestamp: new Date(),
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
