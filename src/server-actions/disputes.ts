"use server";

import { adminDB } from "@/firebase/server-admin";
import { Timestamp } from "firebase-admin/firestore";
import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie"; // Replaced client-side hook

// ------------------------------
// 🔥 Utility: Admin / SuperAdmin enforcement
// ------------------------------
async function assertAdmin() {
  const user = await getUserFromSessionCookie();

  if (!user || !user.role || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }

  return user;
}

// ------------------------------
// 🔥 GET ALL DISPUTES (Admin Only)
// ------------------------------
export async function getDisputes(limit = 100) {
  await assertAdmin();

  const snapshot = await adminDB
    .collection("disputes")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 GET DISPUTES BY RENTER
// ------------------------------
export async function getDisputesByRenter(renterId: string) {
  await assertAdmin();

  const snapshot = await adminDB
    .collection("disputes")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 GET DISPUTES BY COMPANY
// ------------------------------
export async function getDisputesByCompany(companyId: string) {
  await assertAdmin();

  const snapshot = await adminDB
    .collection("disputes")
    .where("companyId", "==", companyId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ------------------------------
// 🔥 GET DISPUTE BY ID
// ------------------------------
export async function getDisputeById(disputeId: string) {
  await assertAdmin();

  const doc = await adminDB.collection("disputes").doc(disputeId).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

// ------------------------------
// 🔥 CREATE A DISPUTE (Renter or Company)
// ------------------------------
export async function createDispute(payload: any) {
  const user = await assertAdmin();

  const disputeRef = adminDB.collection("disputes").doc();

  const data = {
    renterId: payload.renterId,
    incidentId: payload.incidentId,
    companyId: payload.companyId,

    industry: payload.industry, // HOME, AUTO, EQUIPMENT, etc.

    explanation: payload.explanation || "",
    evidence: payload.evidence || [],

    status: "pending_review",
    adminNotes: "",

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await disputeRef.set(data);

  return { id: disputeRef.id, ...data };
}

// ------------------------------
// 🔥 UPDATE DISPUTE
// ------------------------------
export async function updateDispute(disputeId: string, updates: any) {
  await assertAdmin();

  updates.updatedAt = Timestamp.now();

  await adminDB.collection("disputes").doc(disputeId).update(updates);

  return { success: true };
}

// ------------------------------
// 🔥 ATTACH EVIDENCE
// ------------------------------
export async function attachEvidence(disputeId: string, files: string[]) {
  await assertAdmin();

  const disputeRef = adminDB.collection("disputes").doc(disputeId);

  await disputeRef.update({
    evidence: adminDB.FieldValue.arrayUnion(...files),
    updatedAt: Timestamp.now(),
  });

  return { success: true };
}

// ------------------------------
// 🔥 RESOLVE DISPUTE (Admin-Only Workflow)
// ------------------------------
export async function resolveDispute(disputeId: string, resolution: any) {
  await assertAdmin();

  const { status, adminNotes } = resolution;

  if (
    !["resolved_favor_renter", "resolved_favor_company", "under_review"].includes(status)
  ) {
    throw new Error("Invalid resolution status");
  }

  await adminDB.collection("disputes").doc(disputeId).update({
    status,
    adminNotes: adminNotes || "",
    updatedAt: Timestamp.now(),
  });

  return { success: true };
}
