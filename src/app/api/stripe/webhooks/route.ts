import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/firebase/server";

/* -------------------------------------------------------------------------- */
/*                            ROUTE SEGMENT CONFIG                             */
/* -------------------------------------------------------------------------- */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                               ENV SAFETY                                   */
/* -------------------------------------------------------------------------- */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

/* -------------------------------------------------------------------------- */
/*                               STRIPE INIT                                  */
/* -------------------------------------------------------------------------- */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/* -------------------------------------------------------------------------- */
/*                          STRIPE WEBHOOK HANDLER                             */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // ✅ REQUIRED: raw body for Stripe verification
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  try {
    /* =========================================================================
     * CHECKOUT COMPLETED
     * ========================================================================= */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const type = metadata.type;

      /* ------------------------ FULL REPORT UNLOCK ------------------------- */
      if (type === "full-report") {
        const unlockId = metadata.unlockId;
        const reportId = metadata.reportId;
        const userId = metadata.userId || null;
        const companyId = metadata.companyId || null;

        if (!unlockId || !reportId) {
          console.error("❌ Missing metadata for report unlock");
          return NextResponse.json({ received: true });
        }

        await adminDb.collection("reportUnlocks").doc(unlockId).set({
          unlockId,
          reportId,
          userId,
          companyId,
          timestamp: Date.now(),
          stripeSessionId: session.id,
          amountPaid: session.amount_total,
          currency: session.currency,
          type: "full-report",
        });

        await adminDb.collection("internalReports").doc(reportId).update({
          unlocked: true,
        });

        await adminDb.collection("searchAudit").add({
          event: "full_report_unlocked",
          unlockId,
          reportId,
          userId,
          companyId,
          timestamp: Date.now(),
          stripeSessionId: session.id,
        });

        console.log("✅ Full report unlocked:", reportId);
      }

      /* ---------------------- IDENTITY CHECK PURCHASE ---------------------- */
      if (type === "identity-check") {
        const searchSessionId = metadata.searchSessionId;

        if (searchSessionId) {
          await adminDb
            .collection("identityChecks")
            .doc(searchSessionId)
            .set(
              {
                verified: true,
                paid: true,
                timestamp: Date.now(),
              },
              { merge: true }
            );

          console.log("✅ Identity check marked complete:", searchSessionId);
        }
      }
    }

    /* =========================================================================
     * OPTIONAL: PAYMENT FAILURE
     * ========================================================================= */
    if (event.type === "checkout.session.async_payment_failed") {
      console.error("❌ Async payment failed:", event.data.object.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
