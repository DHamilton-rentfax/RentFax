import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { clientId, renterId, endpoint, timestamp } = await req.json();
    if (!clientId) return new Response("Missing clientId", { status: 400 });

    // Store usage locally
    await adminDb.collection("apiUsageLogs").add({
      clientId,
      renterId,
      endpoint,
      timestamp,
    });

    // Increment usage counter
    const clientRef = adminDb.collection("enterpriseClients").doc(clientId);
    await clientRef.update({ usageCount: FieldValue.increment(1) });

    // Report to Stripe (metered billing)
    const snap = await clientRef.get();
    const client = snap.data();
    if (client?.stripeSubscriptionId) {
      await stripe.subscriptionItems.createUsageRecord(
        client.stripeSubscriptionId,
        {
          quantity: 1,
          timestamp: Math.floor(Date.now() / 1000),
          action: "increment",
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Usage logging failed:", err);
    return new Response(JSON.stringify({ error: "Failed to log usage" }), {
      status: 500,
    });
  }
}
