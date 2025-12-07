import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

/* -------------------------------------------------------------------------------------------------
 * STRIPE INIT
 * ------------------------------------------------------------------------------------------------*/
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/* -------------------------------------------------------------------------------------------------
 * CONFIG
 * ------------------------------------------------------------------------------------------------*/
export const config = {
  api: {
    bodyParser: false, // Required for Stripe to validate signature
  },
};

/* Convert raw Request body to buffer */
async function buffer(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/* -------------------------------------------------------------------------------------------------
 * POST — STRIPE WEBHOOK HANDLER
 * ------------------------------------------------------------------------------------------------*/
export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req.body);
    const signature = req.headers.get("stripe-signature") as string;

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    /* =============================================================================================
     * 1. SUCCESSFUL PAYMENT INTENT (COVERS CHECKOUT)
     * =============================================================================================*/
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata || {};
      const type = metadata.type;

      /* ----------------------------------------------------------------------------
       * A) FULL REPORT UNLOCK
       * ---------------------------------------------------------------------------*/
      if (type === "full-report") {
        const unlockId = metadata.unlockId;
        const reportId = metadata.reportId;
        const userId = metadata.userId || null;
        const companyId = metadata.companyId || null;

        console.log("🔓 Full report payment confirmed:", { unlockId, reportId });

        if (!reportId || !unlockId) {
          console.error("❌ Missing metadata for report unlock.");
          return NextResponse.json({ received: true });
        }

        // Write unlock record
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

        // Update report so UI knows it's unlocked
        await adminDb.collection("internalReports").doc(reportId).update({
          unlocked: true,
        });

        // Log unlock event for auditing
        await adminDb.collection("searchAudit").add({
          event: "full_report_unlocked",
          unlockId,
          reportId,
          userId,
          companyId,
          timestamp: Date.now(),
          stripeSessionId: session.id,
        });

        console.log("✅ Full report unlocked in Firestore.");
      }

      /* ----------------------------------------------------------------------------
       * B) IDENTITY CHECK PURCHASE (4.99)
       * ---------------------------------------------------------------------------*/
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

          console.log("✅ Identity verification paid & marked complete.");
        }
      }
    }

    /* =============================================================================================
     * 2. PAYMENT FAILED (optional handling)
     * =============================================================================================*/
    if (event.type === "checkout.session.async_payment_failed") {
      console.error("❌ Payment failed:", event.data.object.id);
    }

    /* =============================================================================================
     * 3. RETURN A SAFE 200 RESPONSE
     * =============================================================================================*/
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook internal error" }, { status: 500 });
  }
}
