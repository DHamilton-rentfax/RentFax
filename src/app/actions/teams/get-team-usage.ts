"use server";

import { getAdminDb } from "@/firebase/server";

export async function getTeamUsage(teamId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const membersSnap = await adminDb
    .collection("teams")
    .doc(teamId)
    .collection("members")
    .get();

  let totalSearches = 0;
  let totalReports = 0;

  for (const doc of membersSnap.docs) {
    const usage = 
      (await adminDb.collection("usage").doc(doc.id).get()).data() || {};

    totalSearches += usage.searchesThisMonth || 0;
    totalReports += usage.reportsThisMonth || 0;
  }

  return { totalSearches, totalReports };
}
