import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth, adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { addonId } = await req.json();
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const companyId = decoded.companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: "User is not associated with a company." },
        { status: 400 },
      );
    }

    const companyDoc = await adminDb
      .collection("companies")
      .doc(companyId)
      .get();
    const customerId = companyDoc.data()?.stripe?.customer;
    const subscriptionId = companyDoc.data()?.stripe?.subscription;

    if (!customerId || !subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found for this company" },
        { status: 404 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items"],
    });

    const itemToCancel = subscription.items.data.find((i) =>
      i.price.lookup_key?.startsWith(addonId),
    );

    if (!itemToCancel) {
      return NextResponse.json(
        { error: "Add-on not found in current subscription" },
        { status: 404 },
      );
    }

    // Set quantity to 0 to remove it
    await stripe.subscriptionItems.update(itemToCancel.id, { quantity: 0 });

    // Firestore update is handled by the 'customer.subscription.updated' webhook
    // for a single source of truth.

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Cancel addon error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
