"use server";

import { adminDb } from "@/lib/firebase/server";

export async function getRevenueMetrics() {
  const snapshot = await adminDb.collection("revenue_logs").get();

  let total = 0;
  let count = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (typeof data.amount === "number") {
      total += data.amount;
      count++;
    }
  });

  return {
    totalRevenue: total,
    transactionCount: count,
    averageRevenue: count > 0 ? total / count : 0,
  };
}
