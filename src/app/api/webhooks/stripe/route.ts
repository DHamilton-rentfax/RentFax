import "server-only";
import { adminDb } from "@/lib/server/firebase-admin";
import { stripe } from "@/lib/stripe/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
        { error: "Missing Stripe signature or webhook secret" },
        { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await adminDb
            .collection("products")
            .doc(event.data.object.id)
            .set(event.data.object);
          break;
        case "price.created":
        case "price.updated":
          await adminDb
            .collection("products")
            .doc(event.data.object.product as string)
            .collection("prices")
            .doc(event.data.object.id)
            .set(event.data.object);
          break;
        case "customer.subscription.created": {
          const sub = event.data.object as Stripe.Subscription;
          const uid = sub.metadata?.uid;
          if (!uid) break;
          await adminDb.collection("users").doc(uid).update({
            subscription: {
              id: sub.id,
              status: sub.status,
            },
          });
          break;
        }
        case "customer.subscription.updated": {
          const sub = event.data.object as Stripe.Subscription;
          const uid = sub.metadata?.uid;
          if (!uid) break;
          await adminDb.collection("users").doc(uid).update({
            subscription: {
              id: sub.id,
              status: sub.status,
            },
          });
          break;
        }
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          const uid = sub.metadata?.uid;
          if (!uid) break;
          await adminDb
            .collection("users")
            .doc(uid)
            .update({
              subscription: null,
            });
          break;
        }
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (!session.subscription) {
            console.log("Checkout session did not have a subscription");
            break;
          }
          const subscription = (await stripe.subscriptions.retrieve(
            session.subscription as string
          )) as Stripe.Subscription;

          const uid = subscription.metadata?.uid;
          if (!uid) break;

          const item = subscription.items.data[0];

          await adminDb.collection("users").doc(uid).update({
            subscription: {
              id: subscription.id,
              status: subscription.status,
              price_id: item?.price?.id ?? null,
              created_at: subscription.created,
              period_ends_at: subscription.current_period_end,
            },
          });
          break;
        }
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
