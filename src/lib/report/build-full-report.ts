import { adminDb } from "@/firebase/server";

export async function buildFullReport(renterId: string) {
  // 1. Pull renter profile
  const renterDoc = await adminDb.collection("renters").doc(renterId).get();
  if (!renterDoc.exists) throw new Error("Renter not found.");

  const renter = renterDoc.data();

  // 2. Get incidents
  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const incidents = incidentsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // 3. Get disputes
  const disputesSnap = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const disputes = disputesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // 4. Identity / Fraud signals
  const fraudSnap = await adminDb
    .collection("fraudChecks")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  const fraud =
    fraudSnap.empty ? null : {
      ...fraudSnap.docs[0].data(),
    };

  // 5. Verification
  const verificationSnap = await adminDb
    .collection("identityVerifications")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  const verification =
    verificationSnap.empty ? null : verificationSnap.docs[0].data();

  // 6. Timeline
  const timeline = [
    ...(incidents || []).map((i) => ({
      type: "incident",
      createdAt: i.createdAt,
      message: `Incident reported: ${i.type}`,
    })),
    ...(disputes || []).map((d) => ({
      type: "dispute",
      createdAt: d.createdAt,
      message: `Renter submitted dispute.`,
    })),
    ...(verification
      ? [
          {
            type: "verification",
            createdAt: verification.createdAt,
            message: "Identity verification submitted.",
          },
        ]
      : []),
  ].sort((a, b) => a.createdAt - b.createdAt);

  return {
    renter,
    incidents,
    disputes,
    fraud,
    verification,
    timeline,
  };
}
