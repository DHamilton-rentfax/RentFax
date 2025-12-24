"use server";

import Stripe from "stripe";
import { adminDb } from "@/firebase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripeInvoiceForStatement({
  statementId,
}: {
  statementId: string;
}) {
  if (process.env.ENABLE_STRIPE_USAGE_INVOICES !== "true") {
    throw new Error("Stripe usage invoicing disabled");
  }

  const ref = adminDb.collection("partner_billing_statements").doc(statementId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Statement not found");

  const st = snap.data()!;
  if (st.status !== "approved") throw new Error("Statement must be approved first");

  const orgSnap = await adminDb.collection("partner_orgs").doc(st.partnerOrgId).get();
  const org = orgSnap.data();
  const customerId = org?.billing?.stripeCustomerId;
  if (!customerId) throw new Error("Partner has no Stripe customer");

  // Create invoice items
  for (const li of st.lineItems || []) {
    await stripe.invoiceItems.create({
      customer: customerId,
      currency: st.currency || "usd",
      description: li.description,
      amount: li.amount,
    });
  }

  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: false, // admin controls finalization in beta
    collection_method: "send_invoice",
    days_until_due: 14,
  });

  await ref.update({
    status: "invoiced",
    stripeInvoiceId: invoice.id,
    updatedAt: new Date(),
  });

  return { stripeInvoiceId: invoice.id };
}
