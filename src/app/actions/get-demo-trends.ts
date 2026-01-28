import { getAdminDb } from "@/firebase/server";

export async function getDemoTrendData() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const ninetyDaysAgo = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const snap = await adminDb
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

  const trialSnap = await adminDb
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

  const paidSnap = await adminDb
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
