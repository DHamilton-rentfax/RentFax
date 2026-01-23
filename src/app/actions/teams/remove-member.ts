"use server";

import { adminDb } from "@/firebase/server";

export async function removeTeamMember(teamId: string, userId: string) {
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
