"use server";

import { adminDb } from "@/firebase/server-admin";
import { Timestamp } from "firebase-admin/firestore";

// ------------------------------
// 🔥 Utility: Enforce Admin / Super Admin
// ------------------------------
async function assertAdmin() {
  const { currentUser } = await import("@/utils/auth-server");
  const user = await currentUser();

  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  return user;
}

// ------------------------------
// 🔥 GET INCIDENTS BY RENTER
// ------------------------------
export async function getIncidentsByRenter(renterId: string) {
  await assertAdmin();

  const snapshot = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 GET INCIDENT BY ID
// ------------------------------
export async function getIncidentById(incidentId: string) {
  await assertAdmin();

  const doc = await adminDb.collection("incidents").doc(incidentId).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

// ------------------------------
// 🔥 GET INCIDENTS BY COMPANY
// ------------------------------
export async function getIncidentsByCompany(companyId: string) {
  await assertAdmin();

  const snapshot = await adminDb
    .collection("incidents")
    .where("companyId", "==", companyId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 CREATE INCIDENT
// ------------------------------
export async function createIncident(payload: any) {
  const user = await assertAdmin();

  const incidentRef = adminDb.collection("incidents").doc();

  const data = {
    renterId: payload.renterId,
    companyId: payload.companyId,
    industry: payload.industry, // HOME, AUTO, EQUIPMENT, STORAGE, LUXURY, SHORT_TERM

    type: payload.type,
    description: payload.description || "",
    amount: payload.amount || 0,

    evidence: payload.evidence || [],

    status: "reported", // reported, disputed, resolved

    occurredAt: payload.occurredAt
      ? Timestamp.fromDate(new Date(payload.occurredAt))
      : Timestamp.now(),

    createdAt: Timestamp.now(),
    createdBy: user.uid,
  };

  await incidentRef.set(data);

  return { id: incidentRef.id, ...data };
}

// ------------------------------
// 🔥 UPDATE INCIDENT
// ------------------------------
export async function updateIncident(incidentId: string, updates: any) {
  await assertAdmin();

  updates.updatedAt = Timestamp.now();

  await adminDb.collection("incidents").doc(incidentId).update(updates);

  return { success: true };
}

// ------------------------------
// 🔥 DELETE INCIDENT
// ------------------------------
export async function deleteIncident(incidentId: string) {
  await assertAdmin();

  await adminDb.collection("incidents").doc(incidentId).delete();

  return { success: true };
}

// ------------------------------
// 🔥 INDUSTRY STATS (FOR DASHBOARD)
// ------------------------------
export async function getIndustryStats() {
  await assertAdmin();

  const snapshot = await adminDb.collection("incidents").get();

  const stats = {
    HOME: 0,
    AUTO: 0,
    EQUIPMENT: 0,
    STORAGE: 0,
    LUXURY: 0,
    SHORT_TERM: 0,
  };

  snapshot.forEach((doc) => {
    const d = doc.data();
    if (stats[d.industry] !== undefined) {
      stats[d.industry]++;
    }
  });

  return stats;
}
