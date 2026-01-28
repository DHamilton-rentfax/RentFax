import { NextResponse } from "next/server";
import Stripe from "stripe";
import { verifySession } from "@/lib/auth/verifySession";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

/* -------------------------------------------------------------------------- */
/* BILLING PORTAL (SECURE, ORG-BASED)                                          */
/* -------------------------------------------------------------------------- */
export async function POST() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await verifySession();

  if (!session?.uid || !session.orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ---------------------------------------------------------------------- */
  /* LOAD ORG                                                                */
  /* ---------------------------------------------------------------------- */
  const orgRef = adminDb.collection("orgs").doc(session.orgId);
  const orgSnap = await orgRef.get();

  if (!orgSnap.exists) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const org = orgSnap.data()!;

  /* ---------------------------------------------------------------------- */
  /* SUPER ADMIN / INTERNAL OVERRIDE                                         */
  /* ---------------------------------------------------------------------- */
  if (org.billing?.override === true) {
    await orgRef.collection("auditLogs").add({
      action: "BILLING_PORTAL_BYPASS",
      performedBy: session.uid,
      reason: "INTERNAL_OVERRIDE",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      url: `${APP_URL}/dashboard?billing=internal`,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* STRIPE CUSTOMER VALIDATION                                              */
  /* ---------------------------------------------------------------------- */
  const customerId = org.billing?.customerId;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for organization" },
      { status: 400 }
    );
  }

  /* ---------------------------------------------------------------------- */
  /* CREATE PORTAL SESSION                                                   */
  /* ---------------------------------------------------------------------- */
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/dashboard`,
  });

  /* ---------------------------------------------------------------------- */
  /* AUDIT LOG                                                              */
  /* ---------------------------------------------------------------------- */
  await orgRef.collection("auditLogs").add({
    action: "OPEN_BILLING_PORTAL",
    performedBy: session.uid,
    stripeCustomerId: customerId,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ url: portalSession.url });
}
