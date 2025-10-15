import { NextResponse } from "next/server";
import Stripe from "stripe";
import { firestore } from "@/firebase/client/admin";
import admin from "firebase-admin";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const findUserByEmail = async (email: string) => {
  const usersRef = firestore.collection("users");
  const snapshot = await usersRef.where("email", "==", email).limit(1).get();
  if (snapshot.empty) {
    console.warn(`No user found with email: ${email}`);
    return null;
  }
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ref: userDoc.ref, ...userDoc.data() };
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    const buf = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email =
          session.customer_details?.email || session.customer_email;
        const metadataType = session.metadata?.type;

        if (!email) {
          console.error("No email found in checkout session.");
          break;
        }

        const user = await findUserByEmail(email);
        if (!user) break;

        if (metadataType === "verification" || metadataType === "report") {
          const collectionName =
            metadataType === "verification"
              ? "verifications"
              : "reports";

          await firestore.collection(collectionName).add({
            createdBy: user.id,
            aiConfidence:
              metadataType === "verification"
                ? Math.floor(Math.random() * 10) + 90
                : undefined,
            riskScore:
              metadataType === "report"
                ? Math.floor(Math.random() * 40) + 60
                : undefined,
            riskLevel:
              metadataType === "report" ? "Moderate" : undefined,
            verificationType: "summary",
            createdAt: timestamp,
          });

          await user.ref.update({
            creditsRemaining: admin.firestore.FieldValue.increment(-1),
          });
          console.log(
            `✅ ${metadataType} processed for ${email}. Credits decremented.`
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email;
        if (!email) break;

        const user = await findUserByEmail(email);
        if (!user) break;

        const planId = invoice.lines.data[0]?.price?.lookup_key;
        let credits = 10;
        if (planId === "price_pro_plan") credits = 50;
        if (planId === "price_unlimited_plan") credits = 9999;

        await user.ref.update({
          plan: planId,
          creditsRemaining: credits,
          nextBillingDate: admin.firestore.Timestamp.fromMillis(
            invoice.period_end * 1000
          ),
        });
        console.log(
          `✅ Subscription renewal for ${email}. Plan: ${planId}, Credits: ${credits}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await findUserByEmail(subscription.metadata.email);
        if (!user) break;

        await user.ref.update({
          plan: "free",
          creditsRemaining: 0,
        });
        console.log(
          `✅ Subscription canceled for ${subscription.metadata.email}. Plan set to free.`
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handling error:", err);
    return new NextResponse("Webhook Error", { status: 500 });
  }
}
