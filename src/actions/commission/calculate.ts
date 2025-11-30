
"use server";

import { db } from "@/lib/firebase/server";
import { doc, getDoc, collection, setDoc, serverTimestamp } from "firebase/firestore";

export async function calculateCommission({ repId, deal }: any) {
  const globalRef = doc(db, "commission_settings", "global");
  const globalSnap = await getDoc(globalRef);
  const global = globalSnap.data();

  const repRef = doc(db, "rep_commission", repId);
  const repSnap = await getDoc(repRef);
  const repOverride = repSnap.exists() ? repSnap.data() : null;

  const rate = repOverride?.rate ?? global.baseRate;
  const enterpriseRate = repOverride?.overrides?.enterprise ?? global.enterpriseRate;

  const isEnterprise = deal.amountMonthly >= 20000;
  const commissionRate = isEnterprise ? enterpriseRate : rate;
  const commissionAmount = deal.amountMonthly * commissionRate;

  const ref = doc(collection(db, "commission_logs"));
  await setDoc(ref, {
    repId,
    dealId: deal.id,
    amountMonthly: deal.amountMonthly,
    commissionRate,
    commissionAmount,
    createdAt: serverTimestamp(),
  });

  return {
    commissionRate,
    commissionAmount,
  };
}
