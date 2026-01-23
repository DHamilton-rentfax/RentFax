"use server";

import { adminDb } from "@/firebase/server";

export async function addTeamMember(teamId: string, userId: string, role = "MEMBER") {
  const teamRef = adminDb.collection("teams").doc(teamId);
  const team = (await teamRef.get()).data();

  if (!team) throw new Error("Team not found");

  if (team.seatsUsed >= team.seatsPurchased) {
    throw new Error("Seat limit reached");
  }

  await adminDb
    .collection("teams")
    .doc(teamId)
    .collection("members")
    .doc(userId)
    .set({
      role,
      joinedAt: Date.now(),
    });

  await teamRef.update({
    seatsUsed: team.seatsUsed + 1,
  });

  return { success: true };
}
