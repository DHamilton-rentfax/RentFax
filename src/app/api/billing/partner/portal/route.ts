import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
        return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    }

    const collectionName = role === "agency" ? "collectionAgencies" : "legalPartners";
    const userRef = adminDb.collection(collectionName).doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    if (!userData || !userData.stripeCustomerId) {
      return NextResponse.json({ error: "Stripe customer ID not found for this user." }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${role}-dashboard/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Billing Portal Error:", err);
    return NextResponse.json({ error: "Failed to create billing portal session", details: err.message }, { status: 500 });
  }
}
