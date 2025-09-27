
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { admin, dbAdmin } from "@/lib/firebase-admin";
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
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userToUpdate = await getAuth().getUser(uid);
    const oldRole = userToUpdate.customClaims?.role || 'user';
    
    // Set custom claim
    await getAuth().setCustomUserClaims(uid, { role });

    // Optional: store in Firestore for querying
    await dbAdmin.collection("users").doc(uid).set({ role }, { merge: true });

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
