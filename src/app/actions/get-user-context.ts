"use server";

import { getAdminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { ROLES, Role } from "@/types/roles";

export async function getUserContext(uid: string): Promise<{
  role: Role;
  orgId: string | null;
}> {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  if (!uid) {
    return { role: ROLES.UNINITIALIZED, orgId: null };
  }

  const ref = adminDb.collection("users").doc(uid);
  const snap = await ref.get();

  // ✅ Auto-create user on first login
  if (!snap.exists) {
    await ref.set({
      role: ROLES.UNINITIALIZED,
      status: "active",
      createdAt: Timestamp.now(),
      source: "auth:first_login",
    });

    return { role: ROLES.UNINITIALIZED, orgId: null };
  }

  const data = snap.data()!;

  if (data.status !== "active") {
    return { role: ROLES.UNINITIALIZED, orgId: null };
  }

  return {
    role: data.role as Role,
    orgId: data.companyId ?? null,
  };
}
