import { FieldValue } from "firebase-admin/firestore";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { clientId, packageId } = await req.json();
    if (!clientId || !packageId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const pkgSnap = await getDoc(doc(db, "dataPackages", packageId));
    if (!pkgSnap.exists())
      return NextResponse.json({ error: "Package not found" }, { status: 404 });

    const pkg = pkgSnap.data();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: pkg.title },
            unit_amount: pkg.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/market/success?pkg=${packageId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/market`,
    });

    await addDoc(collection(db, "marketOrders"), {
      clientId,
      packageId,
      status: "pending",
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Purchase error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
