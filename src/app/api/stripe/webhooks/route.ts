import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/lib/firebase-admin";

// ✅ Disable automatic JSON parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  
  // ✅ Read raw body as text, NOT JSON
  const body = await req.text();

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // ✅ Webhook test log
    await adminDB.collection("webhook_test").add({
      receivedAt: new Date().toISOString(),
      eventType: event.type,
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.customer_email) break;

        const userRef = adminDB.collection("users").doc(session.customer_email);
        const subscriptionId = session.subscription as string | undefined;

        await userRef.set(
          {
            stripeCustomerId: session.customer,
            subscriptionId,
            lastCheckout: new Date().toISOString(),
          },
          { merge: true }
        );

        // Add audit log entry
        await adminDB.collection("audit_logs").add({
          type: "CHECKOUT_COMPLETED",
          user: session.customer_email,
          timestamp: new Date().toISOString(),
          details: session.metadata || {},
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const priceIds = sub.items.data.map((i) => i.price.lookup_key);

        const snapshot = await adminDB
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0].ref;
          await userDoc.update({
            activePlan: priceIds[0] || null,
            activeAddOns: priceIds.slice(1),
            subscriptionStatus: sub.status,
            updatedAt: new Date().toISOString(),
          });

          await adminDB.collection("audit_logs").add({
            type: "SUBSCRIPTION_UPDATED",
            user: userDoc.id,
            timestamp: new Date().toISOString(),
            details: { priceIds, status: sub.status },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await adminDB.collection("audit_logs").add({
          type: "INVOICE_PAID",
          timestamp: new Date().toISOString(),
          details: {
            customer: invoice.customer_email,
            total: invoice.total / 100,
            invoiceId: invoice.id,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        const snapshot = await adminDB
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0].ref;
          await userDoc.update({
            activePlan: null,
            activeAddOns: [],
            subscriptionStatus: "canceled",
          });

          await adminDB.collection("audit_logs").add({
            type: "SUBSCRIPTION_CANCELED",
            user: userDoc.id,
            timestamp: new Date().toISOString(),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}