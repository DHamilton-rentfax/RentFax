import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        if (customer.metadata.demoConversion === "true") {
          const usersSnap = await adminDB
            .collection("users")
            .where("email", "==", customer.email)
            .limit(1)
            .get();

          if (!usersSnap.empty) {
            const doc = usersSnap.docs[0];
            await doc.ref.update({
              demoConversion: true,
              source: "DEMO",
            });
          }
        }
        break;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.demoConversion === "true") {
          await adminDB.collection("subscriptions").doc(subscription.id).set({
            stripeCustomerId: subscription.customer,
            status: subscription.status,
            demoConversion: subscription.metadata.demoConversion === "true",
            source: subscription.metadata.source, // RENTER or COMPANY
            plan: subscription.items.data[0].price.lookup_key, // renter_trial or company_trial
            createdAt: new Date(),
          });
        }
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.uid;

        if (!uid) break;

        // Save subscription info to Firestore
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const items = subscription.items.data.map((item) => ({
          priceId: item.price.id,
          lookupKey: item.price.lookup_key,
          quantity: item.quantity,
        }));

        await adminDB.collection("users").doc(uid).set(
          {
            subscription: {
              id: subscriptionId,
              status: subscription.status,
              plan: session.metadata?.plan,
              billingCycle: session.metadata?.billingCycle,
              addons: session.metadata?.addons
                ? session.metadata.addons.split(",").filter(Boolean)
                : [],
              currentPeriodEnd: subscription.current_period_end * 1000,
              items,
            },
          },
          { merge: true }
        );

        console.log(`✅ Synced subscription for user ${uid}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find Firestore user by subscription.customer if stored
        const usersSnap = await adminDB
          .collection("users")
          .where("subscription.id", "==", subscription.id)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          const doc = usersSnap.docs[0];
          await doc.ref.set(
            {
              subscription: {
                ...doc.data().subscription,
                status: subscription.status,
                currentPeriodEnd: subscription.current_period_end * 1000,
              },
            },
            { merge: true }
          );
          console.log(`🔄 Updated subscription status for ${doc.id}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        const usersSnap = await adminDB
          .collection("users")
          .where("subscription.id", "==", subscriptionId)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          const doc = usersSnap.docs[0];
          await doc.ref.set(
            {
              subscription: {
                ...doc.data().subscription,
                status: "past_due",
              },
            },
            { merge: true }
          );
          console.log(`⚠️ Payment failed for ${doc.id}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const usersSnap = await adminDB
          .collection("users")
          .where("subscription.id", "==", subscription.id)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          const doc = usersSnap.docs[0];
          await doc.ref.set(
            {
              subscription: {
                ...doc.data().subscription,
                status: "canceled",
              },
            },
            { merge: true }
          );
          console.log(`🛑 Subscription canceled for ${doc.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
