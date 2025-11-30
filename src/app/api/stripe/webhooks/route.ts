import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

// Placeholder for token generation
function createShareToken(renterId: string): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(renterId + Date.now().toString() + process.env.STRIPE_SECRET_KEY);
    return hash.digest('hex').substring(0, 24);
}


export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle invoice payment success
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.metadata?.companyId) {
        const companyId = invoice.metadata.companyId;
        await adminDb.collection("companies").doc(companyId).update({
            balanceDue: 0,
        });
    }
  }

  // Handle one-time purchase checkout completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type === "public_full_report") {
      const renterId = session.metadata.renterId;
      if (renterId) {
          const token = createShareToken(renterId);

          await adminDb.collection("publicAccess").doc(token).set({
              token,
              renterId: renterId,
              createdAt: Date.now(),
              expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
          });
      }
    }
    
    if (session.metadata?.type === "identity-check") {
        await adminDb
          .collection("identity_purchases")
          .doc(session.id)
          .update({
            status: "completed",
            completedAt: Date.now(),
          });

        // Create identity flag
        if (session.metadata.renterId) {
          await adminDb
            .collection("renter_identity_status")
            .doc(session.metadata.renterId)
            .set({
              verified: true,
              verifiedAt: Date.now(),
              purchaseSession: session.id,
            });
        }
      }
  }

  return NextResponse.json({ received: true });
}
