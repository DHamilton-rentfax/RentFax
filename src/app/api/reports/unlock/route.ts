import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { stripe } from "@/lib/stripe/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get("companyId");
    const reportId = url.searchParams.get("reportId");

    if (!companyId || !reportId) {
      return NextResponse.json({ error: "companyId and reportId required" }, { status: 400 });
    }

    const unlockRef = adminDb
      .collection("reports")
      .doc(reportId)
      .collection("unlocks")
      .doc(companyId);

    const snap = await unlockRef.get();
    return NextResponse.json({ unlocked: snap.exists });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Check failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { companyId, reportId } = await req.json();

    if (!companyId || !reportId) {
      return NextResponse.json({ error: "companyId and reportId required" }, { status: 400 });
    }

    const unlockRef = adminDb
      .collection("reports")
      .doc(reportId)
      .collection("unlocks")
      .doc(companyId);

    // Idempotent: if already unlocked, return unlocked
    const existing = await unlockRef.get();
    if (existing.exists) return NextResponse.json({ unlocked: true });

    // Try credits first (transaction-safe)
    const companyRef = adminDb.collection("companies").doc(companyId);

    try {
      await adminDb.runTransaction(async (tx) => {
        const companySnap = await tx.get(companyRef);
        if (!companySnap.exists) throw new Error("Company not found");

        const company = companySnap.data() || {};
        const credits = Number(company.reportCredits || 0);

        if (credits <= 0) throw new Error("NO_CREDITS");

        tx.update(companyRef, { reportCredits: credits - 1 });

        tx.set(unlockRef, {
          companyId,
          reportId,
          unlockedAt: Date.now(),
          method: "credit",
        });

        const usageRef = companyRef.collection("usage").doc();
        tx.set(usageRef, {
          id: usageRef.id,
          type: "report_unlock",
          reportId,
          cost: 19.99,
          billingMethod: "credit",
          createdAt: Date.now(),
        });
      });

      return NextResponse.json({ unlocked: true });
    } catch (e: any) {
      // If no credits, fall through to Stripe checkout
      if (e?.message !== "NO_CREDITS") throw e;
    }

    // Stripe checkout fallback ($19.99)
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 1999,
            product_data: { name: "RentFAX Full Report Unlock" },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/report/${reportId}?unlock=success`,
      cancel_url: `${origin}/report/${reportId}?unlock=cancel`,
      metadata: {
        type: "report_unlock",
        reportId,
        companyId,
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unlock failed" }, { status: 500 });
  }
}
