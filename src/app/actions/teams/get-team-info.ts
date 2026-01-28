"use server";

import { getAdminDb } from "@/firebase/server";
import { auth } from "@/auth";

export async function getTeamInfo() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Not authenticated");

  // Find what team the user is on
  const memberSnap = await adminDb.collectionGroup("members").where("id", "==", userId).limit(1).get();
  const member = memberSnap.docs[0];

  if (memberSnap.empty) return { team: null, members: [] };

  const teamId = member.ref.parent.parent!.id;

  const teamSnap = await adminDb.collection("teams").doc(teamId).get();
  const team = teamSnap.data();

  const membersSnap = await adminDb.collection("teams").doc(teamId).collection("members").get();
  const members = membersSnap.docs.map(d => ({...d.data(), id: d.id}));

  // Get user emails
  const userIds = members.map(m => m.id);
  const usersSnap = await adminDb.collection("users").where("id", "in", userIds).get();
  const users = usersSnap.docs.map(d => ({ id: d.id, email: d.data().email }));

  for (const member of members) {
      const user = users.find(u => u.id === member.id);
      if (user) {
          member.email = user.email;
      }
  }

  return { team: {...team, id: teamId}, members };
}
