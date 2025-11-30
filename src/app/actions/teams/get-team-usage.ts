"use server";

import { adminDB } from "@/firebase/server";

export async function getTeamUsage(teamId: string) {
  const membersSnap = await adminDB
    .collection("teams")
    .doc(teamId)
    .collection("members")
    .get();

  let totalSearches = 0;
  let totalReports = 0;

  for (const doc of membersSnap.docs) {
    const usage = 
      (await adminDB.collection("usage").doc(doc.id).get()).data() || {};

    totalSearches += usage.searchesThisMonth || 0;
    totalReports += usage.reportsThisMonth || 0;
  }

  return { totalSearches, totalReports };
}
