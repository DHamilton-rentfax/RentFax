"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function calculateCommission({
  repId,
  deal,
}: {
  repId: string;
  deal: {
    id: string;
    amountMonthly: number;
  };
}) {
  /* =========================
     Load global settings
  ========================= */

  const globalSnap = await adminDb
    .collection("commission_settings")
    .doc("global")
    .get();

  if (!globalSnap.exists) {
    throw new Error("Global commission settings not found");
  }

  const global = globalSnap.data()!;

  /* =========================
     Load rep override (optional)
  ========================= */

  const repSnap = await adminDb
    .collection("rep_commission")
    .doc(repId)
    .get();

  const repOverride = repSnap.exists ? repSnap.data() : null;

  /* =========================
     Commission logic
  ========================= */

  const baseRate = repOverride?.rate ?? global.baseRate;
  const enterpriseRate =
    repOverride?.overrides?.enterprise ?? global.enterpriseRate;

  const isEnterprise = deal.amountMonthly >= 20_000;

  const commissionRate = isEnterprise ? enterpriseRate : baseRate;
  const commissionAmount = deal.amountMonthly * commissionRate;

  /* =========================
     Persist audit log
  ========================= */

  await adminDb.collection("commission_logs").add({
    repId,
    dealId: deal.id,
    amountMonthly: deal.amountMonthly,
    commissionRate,
    commissionAmount,
    createdAt: FieldValue.serverTimestamp(),
  });

  /* =========================
     Return result
  ========================= */

  return {
    commissionRate,
    commissionAmount,
  };
}
