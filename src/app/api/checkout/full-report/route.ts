import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import Stripe from "stripe";
import { v4 as uuid } from "uuid";

/* -------------------------------------------------------------------------------------------------
 *  STRIPE INIT
 * ------------------------------------------------------------------------------------------------*/
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/* -------------------------------------------------------------------------------------------------
 *  POST — Create Checkout Session for Full Report Unlock
 * ------------------------------------------------------------------------------------------------*/
export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();

    const {
      reportId,          // The renter report to unlock
      renterName,
      renterEmail,
      userId,
      companyId,
    } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: "Missing reportId" },
        { status: 400 }
      );
    }

    /* ---------------------------------------------------------------------------
     * 1. Validate that the report exists
     * --------------------------------------------------------------------------*/
    const reportRef = adminDb.collection("internalReports").doc(reportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return NextResponse.json(
        { error: "Invalid report - does not exist" },
        { status: 404 }
      );
    }

    const reportData = reportSnap.data() || {};

    /* ---------------------------------------------------------------------------
     * 2. Check if this landlord already unlocked this report
     * --------------------------------------------------------------------------*/
    const unlockRef = adminDb
      .collection("reportUnlocks")
      .where("reportId", "==", reportId)
      .where("userId", "==", userId || null);

    const unlockSnap = await unlockRef.get();

    if (!unlockSnap.empty) {
      // Already purchased — allow instant access
      return NextResponse.json({
        alreadyUnlocked: true,
        url: `/report/${reportId}`,
      });
    }

    /* ---------------------------------------------------------------------------
     * 3. Create a Checkout Session
     * --------------------------------------------------------------------------*/
    const unlockId = uuid(); // This will be referenced in webhook

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/search?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/search?cancel=1`,

      customer_email: renterEmail || undefined,

      metadata: {
        unlockId,
        reportId,
        userId: userId || "",
        companyId: companyId || "",
        renterName: renterName || "",
        type: "full-report",
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Full Report Unlock – ${renterName}`,
              description: "Full access to incident timeline, disputes, fraud signals, payments, and AI risk summary.",
            },
            unit_amount: 2000, // $20.00
          },
          quantity: 1,
        },
      ],
    });

    /* ---------------------------------------------------------------------------
     * 4. Return the checkout URL
     * --------------------------------------------------------------------------*/
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      alreadyUnlocked: false,
    });

  } catch (err: any) {
    console.error("Full report checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
