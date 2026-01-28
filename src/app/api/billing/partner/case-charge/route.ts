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
    const { agencyId, caseId } = await req.json();

    if (!agencyId || !caseId) {
      return NextResponse.json({ error: "agencyId and caseId are required" }, { status: 400 });
    }

    const agencyRef = adminDb.collection("collectionAgencies").doc(agencyId);
    const agencySnap = await agencyRef.get();
    const agencyData = agencySnap.data();

    if (!agencyData || !agencyData.subscriptionId) {
      return NextResponse.json({ error: "Agency or subscription not found" }, { status: 404 });
    }

    // First, find the specific subscription item for the metered price
    const subscriptionItems = await stripe.subscriptionItems.list({
        subscription: agencyData.subscriptionId,
    });

    const meteredItem = subscriptionItems.data.find(
        (item) => item.price.id === process.env.STRIPE_PRICE_CASE_ADDON
    );

    if (!meteredItem) {
        console.error(`Metered item not found for agency ${agencyId} on subscription ${agencyData.subscriptionId}`);
        return NextResponse.json({ error: "Billing configuration error for this agency." }, { status: 500 });
    }

    // Create a usage record for 1 case
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      meteredItem.id,
      {
        quantity: 1, // Charge for one case
        action: "increment", // Add to the existing total for this billing period
      },
      {
        // Idempotency key to prevent double-charging for the same case
        idempotencyKey: `case-charge-${caseId}`,
      }
    );

    // Optional: Log this charge in Firestore for internal tracking
    await adminDb.collection("caseCharges").add({
        agencyId,
        caseId,
        chargeAmount: 4.99, // Store the amount for reporting
        stripeUsageRecordId: usageRecord.id,
        chargedAt: new Date(),
    });

    return NextResponse.json({ success: true, usageRecordId: usageRecord.id });

  } catch (err: any) {
    console.error("Stripe Case Charge Error:", err);
    return NextResponse.json({ error: "Failed to report usage", details: err.message }, { status: 500 });
  }
}
