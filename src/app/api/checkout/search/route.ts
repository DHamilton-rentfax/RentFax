
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { enforceSearchPermission } from "@/lib/billing/enforce";
import { getAdminDb } from "@/firebase/server";
import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie";
import sendReceiptEmail from "@/utils/email/send-receipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const { userId, searchPayload } = body;
    const user = await getUserFromSessionCookie();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const permission = await enforceSearchPermission(userId);
    const renterName = `${searchPayload.firstName} ${searchPayload.lastName}`;

    // If subscription covers it → no checkout needed
    if (!permission.paid) {
      await adminDb
        .collection("searchReceipts")
        .doc(userId)
        .collection("entries")
        .add({
          type: "identity-check",
          amount: 0,
          renterName,
          timestamp: new Date().toISOString(),
          stripeSessionId: null,
          planUsed: permission.planId || "subscription",
        });

      await sendReceiptEmail({
        to: user.email!,
        type: "identity-check",
        amount: 0,
        renterName,
        userName: user.name || user.email!,
        reportUrl: null,
      });

      return NextResponse.json({ url: null, skip: true });
    }

    const price = permission.price;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/search/renter?session=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/search/renter?session=cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: "Renter Identity Check",
              description: `For renter: ${renterName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "IDENTITY_CHECK",
        userId,
        searchPayload: JSON.stringify(searchPayload),
        userName: user.name || user.email!,
        userEmail: user.email!,
        renterName: renterName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("CHECKOUT SEARCH ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
