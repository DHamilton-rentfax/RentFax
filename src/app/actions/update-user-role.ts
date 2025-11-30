"use server";

import { adminAuth, adminDB } from "@/firebase/server";

import { logAuditEvent } from "./log-audit";

export async function updateUserRole(
  userId: string,
  newRole: string,
  adminEmail: string,
) {
  try {
    const userDocRef = adminDB.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    const oldRole = userDoc.data()?.role;

    // Update custom claim
    await adminAuth.setCustomUserClaims(userId, { role: newRole });

    // Update Firestore user doc
    await userDocRef.update({
      role: newRole,
      updatedAt: new Date().toISOString(),
    });

    // Invalidate user's token to force a refresh on the client
    await adminAuth.revokeRefreshTokens(userId);

    // Write to audit log
    await logAuditEvent({
      action: "ROLE_UPDATED",
      targetUser: userDoc.data()?.email, // Log email for better readability
      oldRole,
      newRole,
      changedBy: adminEmail,
      metadata: { reason: "Role change from Super Admin dashboard." },
    });

    return { success: true };
  } catch (err) {
    console.error("Error updating role:", err);
    return { success: false, error: (err as Error).message };
  }
}
