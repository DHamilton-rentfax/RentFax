import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
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
    if (invite?.status !== "pending") {
      return NextResponse.json(
        { error: "Invite already accepted or expired" },
        { status: 400 },
      );
    }

    if (Date.now() > invite.expiresAt) {
      await inviteRef.update({ status: "expired" });
      // Log expiration event
      await adminDb.collection("auditLogs").add({
        type: "INVITE_EXPIRED",
        actorUid: "system",
        targetEmail: invite.email,
        orgId,
        role: invite.role,
        timestamp: Date.now(),
      });
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });
    }

    // Add member to org
    await adminDb
      .collection("orgs")
      .doc(orgId)
      .collection("members")
      .doc(decoded.uid)
      .set({
        role: invite.role,
        email: decoded.email,
        joinedAt: Date.now(),
      });

    // Mark invite as accepted
    await inviteRef.update({
      status: "accepted",
      acceptedBy: decoded.uid,
      acceptedAt: Date.now(),
    });

    // Audit log
    await adminDb.collection("auditLogs").add({
      type: "INVITE_ACCEPTED",
      actorUid: decoded.uid,
      targetEmail: invite.email,
      targetUid: decoded.uid,
      orgId,
      role: invite.role,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
