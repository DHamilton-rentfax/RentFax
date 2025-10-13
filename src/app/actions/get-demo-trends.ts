import { dbAdmin } from "@/lib/firebase-admin";

export async function getDemoTrendData() {
  const ninetyDaysAgo = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const snap = await dbAdmin
    .collection("demoAnalytics")
    .where("createdAt", ">=", ninetyDaysAgo) // last 90 days
    .orderBy("createdAt", "asc")
    .get();

  const buckets: Record<
    string,
    { visits: number; conversions: number; trials: number; paid: number }
  > = {};

  snap.forEach((doc) => {
    const data = doc.data();
    const week = data.createdAt.substring(0, 7); // "YYYY-MM"
    if (!buckets[week])
      buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };

    if (data.event === "demo_role_selected") buckets[week].visits++;
    if (data.event === "demo_conversion") buckets[week].conversions++;
  });

  const trialSnap = await dbAdmin
    .collection("users")
    .where("plan", "in", ["RENTER_TRIAL", "COMPANY_TRIAL"])
    .where("createdAt", ">=", ninetyDaysAgo) // last 90 days
    .orderBy("createdAt", "asc")
    .get();

  trialSnap.forEach((doc) => {
    const data = doc.data();
    const week = data.createdAt.substring(0, 7); // "YYYY-MM"
    if (!buckets[week])
      buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };
    buckets[week].trials++;
  });

  const paidSnap = await dbAdmin
    .collection("users")
    .where("demoConversion", "==", true)
    .where("subscription.status", "==", "active")
    .where("createdAt", ">=", ninetyDaysAgo) // last 90 days
    .orderBy("createdAt", "asc")
    .get();

  paidSnap.forEach((doc) => {
    const data = doc.data();
    const week = data.createdAt.substring(0, 7); // "YYYY-MM"
    if (!buckets[week])
      buckets[week] = { visits: 0, conversions: 0, trials: 0, paid: 0 };
    buckets[week].paid++;
  });

  return Object.entries(buckets).map(([week, values]) => ({ week, ...values }));
}
