import { db } from "@/firebase/server";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { clientId, renterId, endpoint, timestamp } = await req.json();
    if (!clientId) return new Response("Missing clientId", { status: 400 });

    // Store usage locally
    await addDoc(collection(db, "apiUsageLogs"), {
      clientId,
      renterId,
      endpoint,
      timestamp,
    });

    // Increment usage counter
    const clientRef = doc(db, "enterpriseClients", clientId);
    await updateDoc(clientRef, { usageCount: increment(1) });

    // Report to Stripe (metered billing)
    const snap = await getDoc(clientRef);
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
