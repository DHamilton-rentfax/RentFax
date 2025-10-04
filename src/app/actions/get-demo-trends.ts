import { db } from "@/firebase/server";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export async function getDemoTrendData() {
  const snap = await getDocs(
    query(
      collection(db, "demoAnalytics"),
      where("createdAt", ">=", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // last 90 days
      orderBy("createdAt", "asc")
    )
  );

  const buckets: Record<string, { visits: number; conversions: number; trials: number; paid: number }> = {};

  snap.forEach((doc) => {
    const data = doc.data();
    const week = new Date(data.createdAt.toDate()).toISOString().slice(0, 10).substring(0, 7); // "YYYY-MM"
    if (!buckets[week]) buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };

    if (data.event === "demo_role_selected") buckets[week].visits++;
    if (data.event === "demo_conversion") buckets[week].conversions++;
  });

  const trialSnap = await getDocs(
    query(
      collection(db, "users"),
      where("plan", "in", ["RENTER_TRIAL", "COMPANY_TRIAL"]),
      where("createdAt", ">=", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // last 90 days
      orderBy("createdAt", "asc")
    )
  );

  trialSnap.forEach((doc) => {
    const data = doc.data();
    const week = new Date(data.createdAt.toDate()).toISOString().slice(0, 10).substring(0, 7); // "YYYY-MM"
    if (!buckets[week]) buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };
    buckets[week].trials++;
  });

  const paidSnap = await getDocs(
    query(
      collection(db, "users"),
      where("demoConversion", "==", true),
      where("subscription.status", "==", "active"),
      where("createdAt", ">=", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // last 90 days
      orderBy("createdAt", "asc")
    )
  );

  paidSnap.forEach((doc) => {
    const data = doc.data();
    const week = new Date(data.createdAt.toDate()).toISOString().slice(0, 10).substring(0, 7); // "YYYY-MM"
    if (!buckets[week]) buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };
    buckets[week].paid++;
  });



  return Object.entries(buckets).map(([week, values]) => ({ week, ...values }));
}
