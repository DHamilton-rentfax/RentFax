"use server";

import { getAdminDb } from "@/firebase/server";

export async function removeTeamMember(teamId: string, userId: string) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const teamRef = adminDb.collection("teams").doc(teamId);
  const team = (await teamRef.get()).data();

  await adminDb
    .collection("teams")
    .doc(teamId)
    .collection("members")
    .doc(userId)
    .delete();

  await teamRef.update({
    seatsUsed: Math.max(0, team.seatsUsed - 1),
  });

  return { success: true };
}
