"use server";

import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export async function getFullReport(renterId: string) {
  const app = getFirebaseAdminApp();
  const db = getFirestore(app);

  const renterRef = db.collection("verifiedRenters").doc(renterId);
  const renterSnap = await renterRef.get();

  if (!renterSnap.exists) {
    throw new Error("Renter not found in RentFAX.");
  }

  const renter = renterSnap.data();

  const incidentsSnap = await db
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("dateCreated", "desc")
    .get();

  const fraudSnap = await db
    .collection("fraudSignals")
    .where("renterId", "==", renterId)
    .get();

  return {
    renterId,
    identity: renter.identity || {},
    profile: renter.profile || {},
    incidents: incidentsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    fraudSignals: fraudSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}
