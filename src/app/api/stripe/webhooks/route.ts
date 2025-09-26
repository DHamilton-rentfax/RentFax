import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/firebase/server";

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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const userSnap = await adminDB
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!userSnap.empty) {
          const userRef = userSnap.docs[0].ref;

          const planPriceId = subscription.items.data[0].price.lookup_key;
          const addons = subscription.items.data
            .slice(1)
            .map((i) => i.price.lookup_key);

          await userRef.update({
            plan: planPriceId,
            addons,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: subscription.current_period_end * 1000,
            updatedAt: new Date(),
          });
        }
        break;
      }

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
        }
        break;
      }

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
              credits: (userSnap.docs[0].get("credits") || 0) + 1,
              updatedAt: new Date(),
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
