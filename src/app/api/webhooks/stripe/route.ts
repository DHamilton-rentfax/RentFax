
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import {
  mapPlanToProvisioning,
  ProvisioningConfig,
} from "@/lib/provisioning/applyStripeSubscription";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

async function applyProvisioning(
  orgRef: FirebaseFirestore.DocumentReference,
  config: ProvisioningConfig,
  billing: {
    customerId?: string;
    subscriptionId?: string;
    currentPeriodEnd?: Date;
  }
) {
  await orgRef.update({
    plan: config.plan,
    limits: config.limits,
    features: config.features,
    seats: {
      limit: config.seats.limit,
    },
    billing,
    status: "ACTIVE",
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/* -------------------------------------------------------------------------- */
/* WEBHOOK HANDLER                                                             */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook verification failed", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    /* ---------------------------------------------------------------------- */
    /* CHECKOUT COMPLETE                                                       */
    /* ---------------------------------------------------------------------- */
    case "checkout.session.completed": {
      const session: any = event.data.object;

      /* ---------------- PAYG / PDPL (INTENT-BASED) ---------------- */
      if (session.metadata?.intentId) {
        const intentRef = adminDb
          .collection("payment_intents")
          .doc(session.metadata.intentId);

        const snap = await intentRef.get();
        if (!snap.exists) break;

        if (snap.data()?.status !== "paid") {
          await intentRef.update({
            status: "paid",
            stripeSessionId: session.id,
            completedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      /* ---------------- SUBSCRIPTION ---------------- */
      if (session.mode === "subscription" && session.metadata?.orgId) {
        const orgRef = adminDb.collection("orgs").doc(session.metadata.orgId);

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        const planKey = subscription.items.data[0]?.price.id;
        if (!planKey) break;

        const config = mapPlanToProvisioning(planKey);

        await applyProvisioning(orgRef, config, {
          customerId: session.customer,
          subscriptionId: subscription.id,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        });

        await orgRef.update({
          "credits.available": FieldValue.increment(
            config.credits.monthlyAllocation
          ),
          "credits.reserved": 0,
        });
      }
      break;
    }

    /* ---------------------------------------------------------------------- */
    /* SUBSCRIPTION UPDATED                                                    */
    /* ---------------------------------------------------------------------- */
    case "customer.subscription.updated": {
      const sub: any = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (!orgId) break;

      const planKey = sub.items.data[0]?.price.id;
      if (!planKey) break;

      const config = mapPlanToProvisioning(planKey);
      const orgRef = adminDb.collection("orgs").doc(orgId);

      await applyProvisioning(orgRef, config, {
        subscriptionId: sub.id,
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
      });
      break;
    }

    /* ---------------------------------------------------------------------- */
    /* SUBSCRIPTION CANCELED                                                   */
    /* ---------------------------------------------------------------------- */
    case "customer.subscription.deleted": {
      const sub: any = event.data.object;
      const orgId = sub.metadata?.orgId;
      if (!orgId) break;

      const free = mapPlanToProvisioning("price_free_monthly");
      const orgRef = adminDb.collection("orgs").doc(orgId);

      await orgRef.update({
        plan: free.plan,
        limits: free.limits,
        features: free.features,
        seats: { limit: free.seats.limit },
        status: "CANCELED",
        "billing.subscriptionId": null,
        "credits.available": 0,
        "credits.reserved": 0,
        updatedAt: FieldValue.serverTimestamp(),
      });
      break;
    }

    /* ---------------------------------------------------------------------- */
    /* MONTHLY RENEWAL (CREDIT RESET)                                          */
    /* ---------------------------------------------------------------------- */
    case "invoice.payment_succeeded": {
      const invoice: any = event.data.object;
      if (invoice.billing_reason !== "subscription_cycle") break;

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription
      );
      const planKey = subscription.items.data[0]?.price.id;
      if (!planKey) break;

      const config = mapPlanToProvisioning(planKey);

      const snap = await adminDb
        .collection("orgs")
        .where("billing.subscriptionId", "==", subscription.id)
        .limit(1)
        .get();

      if (!snap.empty) {
        await snap.docs[0].ref.update({
          "credits.available": config.credits.monthlyAllocation,
          "credits.reserved": 0,
          "billing.currentPeriodEnd": new Date(
            subscription.current_period_end * 1000
          ),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
