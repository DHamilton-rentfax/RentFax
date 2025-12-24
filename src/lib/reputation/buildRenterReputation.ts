
import { adminDb } from "@/lib/firebase/admin"; // Assuming adminDb is initialized elsewhere
import { RenterReputation } from "@/types/renter-reputation";

export async function buildRenterReputation(renterId: string) {
  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  let total = incidents.size;
  let disputed = 0;
  let resolvedInFavor = 0;
  let unresolved = 0;

  incidents.docs.forEach(d => {
    const i = d.data();
    if (i.disputeId) disputed++;
    if (i.disputeOutcome === "APPROVED") resolvedInFavor++;
    if (!i.resolvedAt) unresolved++;
  });

  let tone: RenterReputation['summaryTone'] = "CLEAR";
  if (unresolved > 0) tone = "MIXED";
  if (unresolved > 2) tone = "CONCERNING";

  await adminDb.collection("renter_reputation").doc(renterId).set({
    totalIncidents: total,
    disputedIncidents: disputed,
    resolvedInFavor,
    unresolved,
    summaryTone: tone,
    updatedAt: new Date(),
  });
}
