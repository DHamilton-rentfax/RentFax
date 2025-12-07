import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/firebase/client-admin";
import { authAdmin } from "@/lib/authAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const user = await authAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { renterId } = await req.json(); // ID of the renter to run the report on

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1PCb25RxK92LgKeaT2gQ4FzF", // PAYG plan price ID from your Stripe account
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/report/new?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        userId: user.uid,
        renterId: renterId,
        reportType: "deep",
      },
    });

    // Pre-emptively create a record in Firestore
    if (session.id) {
      const reportRef = adminDB.collection("deepReports").doc(session.id);
      await reportRef.set({
        status: "pending_payment",
        userId: user.uid,
        renterId: renterId,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
