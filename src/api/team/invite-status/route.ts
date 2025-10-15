import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/client-admin";

export async function POST(req: Request) {
  try {
    const { orgId, inviteId } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    const inviteRef = adminDB
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

      await adminDB.collection("auditLogs").add({
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
