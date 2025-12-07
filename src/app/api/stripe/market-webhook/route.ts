import { db } from "@/firebase/server";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature failed.", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const q = query(
      collection(db, "marketOrders"),
      where("stripeSessionId", "==", session.id),
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const order = snap.docs[0];
      await updateDoc(order.ref, { status: "paid" });

      // simulate partner revenue share: 70/30 split
      await addDoc(collection(db, "partnerPayouts"), {
        orderId: order.id,
        packageId: order.data().packageId,
        amount: ((session.amount_total || 0) * 0.3) / 100,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return new Response("ok", { status: 200 });
}
