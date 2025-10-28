import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const relevantEvents = new Set([
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
]);

// Plan details mapping, associating Stripe Price ID with plan name and credits
const PLAN_DETAILS: { [key: string]: { name: string; caseCredits: number } } = {
    [process.env.STRIPE_PRICE_AGENCY_STARTER!]: { name: 'starter', caseCredits: 10 },
    [process.env.STRIPE_PRICE_AGENCY_PRO!]: { name: 'pro', caseCredits: 50 },
    [process.env.STRIPE_PRICE_AGENCY_ENTERPRISE!]: { name: 'enterprise', caseCredits: 200 },
    // Add legal plans if they also have credits or specific logic
};

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_PARTNERS_WEBHOOK_SECRET) {
    console.error("Webhook secret or signature missing.");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_PARTNERS_WEBHOOK_SECRET);

    if (relevantEvents.has(event.type)) {
        const data = event.data.object as any;
        const customerId = data.customer;

        const [agencySnap, legalSnap] = await Promise.all([
            adminDB.collection("collectionAgencies").where("stripeCustomerId", "==", customerId).limit(1).get(),
            adminDB.collection("legalPartners").where("stripeCustomerId", "==", customerId).limit(1).get(),
        ]);

        const userDoc = !agencySnap.empty ? agencySnap.docs[0] : !legalSnap.empty ? legalSnap.docs[0] : null;

        if (userDoc) {
            const ref = userDoc.ref;
            const subscription = data.lines?.data[0];
            const priceId = subscription?.price.id;
            const planInfo = PLAN_DETAILS[priceId];

            await ref.update({
                subscriptionId: data.id,
                billingStatus: data.status,
                plan: planInfo ? planInfo.name : (userDoc.data().plan || 'standard'),
                caseCredits: planInfo ? planInfo.caseCredits : 0,
                activeUntil: data.current_period_end ? new Date(data.current_period_end * 1000) : null,
                lastPaymentDate: event.type === 'invoice.payment_succeeded' ? new Date() : (userDoc.data().lastPaymentDate || null),
            });
            console.log(`Webhook processed for ${event.type}, user ${userDoc.id}`);
        }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: "Webhook processing failed", details: err.message }, { status: 400 });
  }
}
