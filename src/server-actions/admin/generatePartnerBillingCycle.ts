"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

const PRICING = {
  CASE_NOTE_ADDED: 0.1,
  CASE_EVIDENCE_UPLOADED: 1.0,
};

export async function generatePartnerBillingCycle({
  partnerOrgId,
  start,
  end,
}: {
  partnerOrgId: string;
  start: Date;
  end: Date;
}) {
  const usageSnap = await adminDb
    .collection("partner_usage_logs")
    .where("partnerOrgId", "==", partnerOrgId)
    .where("timestamp", ">=", start)
    .where("timestamp", "<=", end)
    .get();

  let totalAmount = 0;
  const lineItems: any[] = [];

  usageSnap.docs.forEach(doc => {
    const log = doc.data();
    const price = PRICING[log.eventType as keyof typeof PRICING] || 0;
    totalAmount += price;
    lineItems.push({ ...log, price });
  });

  const cycleRef = adminDb.collection("partner_billing_cycles").doc();

  await cycleRef.set({
    partnerOrgId,
    status: "review",
    totalAmount,
    itemCount: lineItems.length,
    lineItems,
    generatedAt: FieldValue.serverTimestamp(),
    period: { start, end },
  });

  return { cycleId: cycleRef.id, totalAmount };
}
