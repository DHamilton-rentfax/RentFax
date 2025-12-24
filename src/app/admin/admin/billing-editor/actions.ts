"use server";

import { adminDB } from "@/firebase/server";
import { doc, getDoc, setDoc } from "firebase/firestore";

const PRICING_DOC_PATH = "config/rentfax-pricing";

export async function fetchPricing() {
  const ref = doc(adminDB, PRICING_DOC_PATH);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Return a default structure if it doesn't exist
    return {
      identityCheck: 4.99,
      fullReport: 20.00,
      plans: {
        landlordPremium: { price: 29, includedReports: 5, overage: 15 },
        companyBasic: { price: 99, includedReports: 25, overage: 12 },
        companyPro: { price: 249, includedReports: 100, overage: 10 },
      },
    };
  }
  return snap.data();
}

export async function updatePricing(data: any) {
  const ref = doc(adminDB, PRICING_DOC_PATH);
  await setDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
