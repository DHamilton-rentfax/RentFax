import { adminDb } from "@/firebase/server";

export async function storeBillingInsights(companyId: string, insights: any) {
  const ref = adminDb
    .collection("companies")
    .doc(companyId)
    .collection("billingInsights")
    .doc("current");

  await ref.set(
    {
      updatedAt: Date.now(),
      ...insights,
    },
    { merge: true }
  );
}
