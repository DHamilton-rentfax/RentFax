"use server";

import { adminDb } from "@/firebase/server-admin";
import { Timestamp } from "firebase-admin/firestore";

// ------------------------------
// 🔥 Utility: enforce admin access
// ------------------------------
async function assertAdmin() {
  const { currentUser } = await import("@/utils/auth-server");
  const user = await currentUser();

  if (!user || !user.role || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  return user;
}

// ------------------------------
// 🔥 GET ALL RENTERS
// ------------------------------
export async function getRenters(limit = 50) {
  await assertAdmin();

  const snapshot = await adminDb
    .collection("renters")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 GET RENTER BY ID
// ------------------------------
export async function getRenterById(renterId: string) {
  await assertAdmin();

  const doc = await adminDb.collection("renters").doc(renterId).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

// ------------------------------
// 🔥 CREATE RENTER
// ------------------------------
export async function createRenter(payload: any) {
  await assertAdmin();

  const renterRef = adminDb.collection("renters").doc();

  const data = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    fullName: `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
    phone: payload.phone,
    rentalTypes: payload.rentalTypes || [], // HOME, AUTO, EQUIPMENT, STORAGE, LUXURY, SHORT_TERM
    addresses: payload.addresses || [],
    status: "ACTIVE",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await renterRef.set(data);

  return { id: renterRef.id, ...data };
}

// ------------------------------
// 🔥 UPDATE RENTER
// ------------------------------
export async function updateRenter(renterId: string, updates: any) {
  await assertAdmin();

  updates.updatedAt = Timestamp.now();

  await adminDb.collection("renters").doc(renterId).update(updates);

  return { success: true };
}

// ------------------------------
// 🔥 DELETE RENTER
// ------------------------------
export async function deleteRenter(renterId: string) {
  await assertAdmin();

  await adminDb.collection("renters").doc(renterId).delete();

  return { success: true };
}

// ------------------------------
// 🔥 GET RENTER ADDRESSES
// ------------------------------
export async function getRenterAddresses(renterId: string) {
  await assertAdmin();

  const doc = await adminDb.collection("renters").doc(renterId).get();
  if (!doc.exists) return [];

  return doc.data()?.addresses || [];
}

// ------------------------------
// 🔥 RENTER TIMELINE (FULL IDENTITY TIMELINE)
// ------------------------------
export async function getRenterTimeline(renterId: string) {
  await assertAdmin();

  const incidentsSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const disputesSnap = await adminDb
    .collection("disputes")
    .where("renterId", "==", renterId)
    .get();

  const fraudSnap = await adminDb
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary")
    .get();

  const timeline: any[] = [];

  incidentsSnap.forEach((doc) => {
    timeline.push({
      type: "incident",
      id: doc.id,
      ...doc.data(),
      sortDate: doc.data().occurredAt,
    });
  });

  disputesSnap.forEach((doc) => {
    timeline.push({
      type: "dispute",
      id: doc.id,
      ...doc.data(),
      sortDate: doc.data().createdAt,
    });
  });

  if (fraudSnap.exists) {
    timeline.push({
      type: "fraud_signal",
      id: "fraud-summary",
      ...fraudSnap.data(),
      sortDate: fraudSnap.data().updatedAt,
    });
  }

  // Sort newest first
  timeline.sort((a, b) => b.sortDate.toMillis() - a.sortDate.toMillis());

  return timeline;
}

// ------------------------------
// 🔥 GET FRAUD SUMMARY
// ------------------------------
export async function getRenterFraudSummary(renterId: string) {
  await assertAdmin();

  const fraudSnap = await adminDb
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary")
    .get();

  if (!fraudSnap.exists) {
    return { score: null, signals: [], alert: false };
  }

  return fraudSnap.data();
}
