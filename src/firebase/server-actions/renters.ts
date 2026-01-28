"use server";

import { getAdminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

// ----------------------------
//  GET ALL RENTERS FOR ADMIN
// ----------------------------
export async function getAllRenters() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const snapshot = await adminDb.collection("renters").get();

    const renters = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return renters;
  } catch (error) {
    console.error("Error fetching renters:", error);
    return [];
  }
}

// ----------------------------
//  GET RENTER DETAILS
// ----------------------------
export async function getRenterById(renterId: string) {
  try {
    const docSnap = await adminDb.collection("renters").doc(renterId).get();

    if (!docSnap.exists) return null;

    return { id: renterId, ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching renter:", error);
    return null;
  }
}

// ----------------------------
//  GET INCIDENTS FOR RENTER
// ----------------------------
export async function getRenterIncidents(renterId: string) {
  try {
    const q = adminDb
      .collection("incidents")
      .where("renterId", "==", renterId);

    const snapshot = await q.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
}

// ----------------------------
//  GET DISPUTES FOR RENTER
// ----------------------------
export async function getRenterDisputes(renterId: string) {
  try {
    const q = adminDb
      .collection("disputes")
      .where("renterId", "==", renterId);

    const snapshot = await q.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return [];
  }
}

// ----------------------------
//  GET FRAUD SIGNALS SUMMARY
// ----------------------------
export async function getFraudSignals(renterId: string) {
  try {
    const docSnap = await adminDb
      .collection("renters")
      .doc(renterId)
      .collection("fraud_signals")
      .doc("summary")
      .get();

    if (!docSnap.exists) return null;

    return { id: "summary", ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching fraud signals:", error);
    return null;
  }
}

// ----------------------------
//  UPDATE RENTER
// ----------------------------
export async function updateRenter(renterId: string, data: any) {
  try {
    await adminDb.collection("renters").doc(renterId).update({
      ...data,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating renter:", error);
    return { success: false };
  }
}

// ----------------------------
//  DELETE RENTER
// ----------------------------
export async function deleteRenter(renterId: string) {
  try {
    await adminDb.collection("renters").doc(renterId).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting renter:", error);
    return { success: false };
  }
}