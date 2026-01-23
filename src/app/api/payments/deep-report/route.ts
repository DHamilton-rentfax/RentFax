import { NextResponse } from "next/server";
import Stripe from "stripe";
import { authUser } from "@/lib/authUser";
import { adminDB } from "@@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const user = await authUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userRef = adminDB.collection("users").doc(user.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { stripeCustomerId } = userData;
    const body = await req.json();
    const { renterName, renterAddress, licenseNumber } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1PQ3dJAbK2S36ClWvISf4biy", // The price ID for the $20 deep report
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_success=true&report_generating=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_canceled=true`,
      customer: stripeCustomerId,
      metadata: {
        userId: user.uid,
        reportType: "deep",
        renterName: renterName || null,
        renterAddress: renterAddress || null,
        licenseNumber: licenseNumber || null,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
