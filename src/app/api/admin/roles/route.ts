
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { dbAdmin, authAdmin } from "@/lib/firebase-admin";
import { logAudit } from "@/ai/flows/audit";

export async function POST(req: Request) {
  try {
    const { uid, role } = await req.json();
    if (!uid || !role) {
      return NextResponse.json({ error: "Missing uid or role" }, { status: 400 });
    }

    // Verify caller is super_admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await authAdmin.verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Only super admins can change roles." }, { status: 403 });
    }

    const userToUpdate = await getAuth().getUser(uid);
    const oldRole = userToUpdate.customClaims?.role || 'user';
    
    // Safety check: a super admin cannot demote themselves
    if (uid === decoded.uid && role !== 'super_admin') {
        return NextResponse.json({ error: "A super admin cannot demote themselves." }, { status: 403 });
    }

    // Set custom claim
    await getAuth().setCustomUserClaims(uid, { ...userToUpdate.customClaims, role });

    // Also store in Firestore for querying if you have a `users` collection
    const userDocRef = dbAdmin.collection("users").doc(uid);
    await userDocRef.set({ role }, { merge: true });

    // Invalidate user's token to force a refresh on the client
    await authAdmin.revokeRefreshTokens(uid);

    // Audit log
    await logAudit({
        actorUid: decoded.uid,
        actorRole: 'super_admin',
        companyId: decoded.companyId || 'SYSTEM',
        action: 'updateUserRole',
        targetPath: `users/${uid}`,
        before: { role: oldRole },
        after: { role },
    });

    return NextResponse.json({ success: true, uid, role });
  } catch (err: any) {
    console.error("Role update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
