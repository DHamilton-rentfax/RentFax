import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
// import { db } from "@/firebase/server"  // optional Firestore

export async function GET() {
  try {
    const products = await stripe.products.list({ expand: ["data.default_price"] });

    const formatted = products.data.map((p) => {
      const price = typeof p.default_price === "object" ? p.default_price : null;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        active: p.active,
        priceId: price?.id || null,
        unitAmount: price?.unit_amount || null,
        currency: price?.currency || "usd",
        interval: price?.recurring?.interval || null,
        metadata: p.metadata,
      };
    });

    // optional Firestore cache
    // const batch = db.batch();
    // formatted.forEach((f) => {
    //   const ref = db.collection("stripe_catalog").doc(f.id);
    //   batch.set(ref, f);
    // });
    // await batch.commit();

    return NextResponse.json({ success: true, products: formatted });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
