import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";

import {
  deductReportCredit,
  getUserPlanAndUsage,
  createFullReportCheckout,
} from "@/lib/billing/reportBilling";

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const app = getFirebaseAdminApp();
    

    const sessionId = params.sessionId;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 401 });
    }

    // 🔒 Role & Plan Enforcement
    const { role } = await getUserPlanAndUsage(userId);

    // renters cannot purchase or run reports on other people
    if (role === "RENTER") {
      return NextResponse.json(
        { error: "Renters cannot purchase full reports." },
        { status: 403 }
      );
    }

    // landlord / company / super admin roles are allowed
    // roles like LANDLORD, COMPANY_ADMIN, COMPANY_USER, SUPER_ADMIN, LEGAL_ADMIN all ok

    const deduction = await deductReportCredit(userId);

    if (deduction.covered) {
      // Mark the search session as upgraded
      await adminDb.collection("searchSessions").doc(sessionId).set(
        {
          upgraded: true,
          upgradedAt: Date.now(),
        },
        { merge: true }
      );

      // Log billing event
      await adminDb.collection("billingEvents").add({
        type: "FULL_REPORT",
        userId,
        sessionId,
        coveredBy: deduction.message,
        planId: deduction.planId,
        amount: 0,
        createdAt: Date.now(),
      });

      return NextResponse.json({
        message: "Full report unlocked via subscription",
        redirect: `/report/${sessionId}`,
      });
    }

    // Not covered → Stripe checkout for overage / pay-go
    const checkoutUrl = await createFullReportCheckout(
      userId,
      sessionId,
      deduction.cost
    );

    // Log that we initiated an overage checkout
    await adminDb.collection("billingEvents").add({
      type: "FULL_REPORT_CHECKOUT",
      userId,
      sessionId,
      planId: deduction.planId,
      amount: deduction.cost,
      createdAt: Date.now(),
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err: any) {
    console.error("search-renter upgrade error:", err);
    return NextResponse.json(
      { error: err.message || "Upgrade failed" },
      { status: 500 }
    );
  }
}
