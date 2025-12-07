import { adminDb } from "@/firebase/server";

export async function calculateCustomerServiceMetrics(companyId: string) {
  const interactionsSnap = await adminDb
    .collection("companyInteractions")
    .where("companyId", "==", companyId)
    .get();

  const interactions = interactionsSnap.docs.map((d) => d.data());

  const responseTimes = interactions
    .filter((i) => i.type === "RESPONSE_TIME")
    .map((i) => i.value);

  const supportRatings = interactions
    .filter((i) => i.type === "SUPPORT_RATING")
    .map((i) => i.value);

  const avgResponse =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : null;

  const avgRating =
    supportRatings.length > 0
      ? supportRatings.reduce((a, b) => a + b, 0) / supportRatings.length
      : null;

  await adminDb
    .collection("companyCustomerServiceMetrics")
    .doc(companyId)
    .set(
      {
        avgResponseTime: avgResponse,
        avgSupportRating: avgRating,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

  return { avgResponse, avgRating };
}
