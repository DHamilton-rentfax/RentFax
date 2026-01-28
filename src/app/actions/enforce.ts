"use server";

import { getAdminDb } from "@/firebase/server";
import { auth } from "@/auth";

export async function enforce() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { allowed: false, reason: "USER_NOT_FOUND" };
  }

  // Super admin has all permissions
  // @ts-ignore
  if (user.role === "SUPER_ADMIN") {
    return { allowed: true };
  }

  // @ts-ignore
  if (user.companyId) {
    // @ts-ignore
    const teamSnap = await adminDb.collection("teams").doc(user.companyId).get();
    const team = teamSnap.data();

    if (!team) {
      return { allowed: false, reason: "TEAM_NOT_FOUND" };
    }

    // If team hits seat limits
    if (team.seatsUsed > team.seatsPurchased) {
      return { allowed: false, reason: "SEAT_LIMIT_REACHED" };
    }
  }

  // Placeholder for other enforcement logic
  return { allowed: true };
}
