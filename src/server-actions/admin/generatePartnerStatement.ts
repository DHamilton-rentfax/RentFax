"use server";

import { adminDb } from "@/firebase/server";

function ym(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function generatePartnerStatement({
  partnerOrgId,
  period = ym(),
}: {
  partnerOrgId: string;
  period?: string; // "YYYY-MM"
}) {
  // Load pricing settings (or default)
  const settingsRef = adminDb.collection("partner_billing_settings").doc(partnerOrgId);
  const settingsSnap = await settingsRef.get();

  const prices = settingsSnap.exists
    ? settingsSnap.data()!.prices
    : { ACTION_TAKEN: 2500, CLOSED_CASE: 1500 }; // default cents

  // Query billing events for that period
  const [year, month] = period.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const evSnap = await adminDb
    .collection("partner_billing_events")
    .where("partnerOrgId", "==", partnerOrgId)
    .where("occurredAt", ">=", start)
    .where("occurredAt", "<", end)
    .get();

  let actionTakenQty = 0;
  let closedQty = 0;

  evSnap.docs.forEach((d) => {
    const e = d.data();
    if (e.eventType === "CASE_ACTION_TAKEN") actionTakenQty += e.units ?? 1;
    if (e.eventType === "CASE_CLOSED") closedQty += e.units ?? 1;
  });

  const lineItems = [
    {
      sku: "ACTION_TAKEN",
      description: "Cases marked Action Taken",
      quantity: actionTakenQty,
      unitAmount: prices.ACTION_TAKEN,
      amount: actionTakenQty * prices.ACTION_TAKEN,
    },
    {
      sku: "CLOSED_CASE",
      description: "Cases Closed",
      quantity: closedQty,
      unitAmount: prices.CLOSED_CASE,
      amount: closedQty * prices.CLOSED_CASE,
    },
  ].filter(li => li.quantity > 0);

  const subtotal = lineItems.reduce((sum, li) => sum + li.amount, 0);

  const statementRef = adminDb.collection("partner_billing_statements").doc();
  await statementRef.set({
    partnerOrgId,
    period,
    status: "draft",
    currency: "usd",
    lineItems,
    totals: { subtotal, total: subtotal },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { statementId: statementRef.id };
}
