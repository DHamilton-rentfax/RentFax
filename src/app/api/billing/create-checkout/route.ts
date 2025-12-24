import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth, adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const uid = decoded.uid;

  const body = await req.json();

  const {
    intent, // "CREATE_REPORT" | "VIEW_LEDGER" | "VERIFY_RENTER"
    renterId,
    verificationId,
  } = body;

  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const user = userSnap.data()!;
  const orgId = user.orgId;

  let priceLookupKey: string;
  let metadata: Stripe.Checkout.Session.Metadata;

  switch (intent) {
    case "VERIFY_RENTER":
      if (!verificationId || !renterId) {
        return NextResponse.json(
          { error: "Invalid request for verification" },
          { status: 400 }
        );
      }
      priceLookupKey = "price_verification_4_99"; // New price key
      metadata = {
        intent,
        renterId,
        verificationId,
        orgId,
        userId: uid,
      };
      break;

    case "CREATE_REPORT":
    case "VIEW_LEDGER":
      if (!renterId) {
        return NextResponse.json(
          { error: "Renter ID is required" },
          { status: 400 }
        );
      }
      priceLookupKey =
        intent === "CREATE_REPORT"
          ? "price_report_create_20"
          : "price_ledger_access_20";
      metadata = {
        intent,
        renterId,
        orgId,
        userId: uid,
      };
      break;

    default:
      return NextResponse.json({ error: "Invalid intent" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: priceLookupKey,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/dashboard/payment-success`,
    cancel_url: `${process.env.APP_URL}/dashboard/payment-cancelled`,
    metadata,
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
