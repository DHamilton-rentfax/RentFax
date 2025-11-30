import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/firebase/server";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const data = event.data.object;

  if (event.type === "checkout.session.completed") {
    const renterId = data.metadata.renterId;
    const userId = data.metadata.userId;
    const type = data.metadata.type;

    if (type === "identity-check") {
      await adminDb.collection("renter_identity_status").doc(renterId).set({
        verified: true,
        verifiedAt: Date.now(),
        method: "payment",
      });
    }

    if (type === "full-report") {
      await adminDb.collection("renter_report_access").add({
        renterId,
        userId,
        purchasedAt: Date.now(),
        validUntil: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }
  }

  return NextResponse.json({ received: true });
}
