"use server";

import { adminDb } from "@/firebase/server"; // your Firebase Admin SDK instance

export async function getAdminAnalytics() {
  try {
    const statsRef = adminDb.collection("analytics").doc("global");
    const doc = await statsRef.get();

    if (!doc.exists) {
      return {
        activeUsers: 0,
        newUsersThisWeek: 0,
        paidUsers: 0,
        freeUsers: 0,
        incidentsReported: 0,
        disputesOpened: 0,
        lastUpdated: null,
      };
    }

    const data = doc.data();

    return {
      activeUsers: data.activeUsers || 0,
      newUsersThisWeek: data.newUsersThisWeek || 0,
      paidUsers: data.paidUsers || 0,
      freeUsers: data.freeUsers || 0,
      incidentsReported: data.incidentsReported || 0,
      disputesOpened: data.disputesOpened || 0,
      lastUpdated: data.lastUpdated?.toDate() || null,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw new Error("Failed to load analytics");
  }
}
