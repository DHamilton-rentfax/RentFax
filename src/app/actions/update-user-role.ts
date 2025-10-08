
"use server";

import { getAuth } from "firebase-admin/auth";
import { adminDB as adminDb } from "@/lib/firebase-admin";
import { logAuditEvent } from "./log-audit";

export async function updateUserRole(userId: string, newRole: string, adminEmail: string) {
  try {
    const auth = getAuth();
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    const oldRole = userDoc.data()?.role;

    // Update custom claim
    await auth.setCustomUserClaims(userId, { role: newRole });

    // Update Firestore user doc
    await userDocRef.update({
      role: newRole,
      updatedAt: new Date().toISOString(),
    });
    
    // Invalidate user's token to force a refresh on the client
    await auth.revokeRefreshTokens(userId);

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
