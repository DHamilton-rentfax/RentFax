import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { orgId, inviteId } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    const inviteRef = adminDb
      .collection("orgs")
      .doc(orgId)
      .collection("invites")
      .doc(inviteId);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const invite = inviteDoc.data();
    if (Date.now() > invite.expiresAt && invite.status === "pending") {
      await inviteDoc.ref.update({ status: "expired" });

      await adminDb.collection("auditLogs").add({
        type: "INVITE_EXPIRED",
        actorUid: "system",
        targetEmail: invite.email,
        orgId,
        role: invite.role,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
