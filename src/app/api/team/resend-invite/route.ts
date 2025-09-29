import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { orgId, inviteId } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    const inviteRef = adminDB.collection("orgs").doc(orgId).collection("invites").doc(inviteId);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const invite = inviteDoc.data();
    if (!["expired", "pending"].includes(invite?.status)) {
      return NextResponse.json({ error: "Invite already accepted" }, { status: 400 });
    }

    // Extend invite 7 more days
    await inviteRef.update({
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      resentBy: decoded.uid,
    });

    // Resend email
    await sgMail.send({
      to: invite.email,
      from: { email: "invites@rentfax.ai", name: "RentFAX" },
      subject: "Your RentFAX Invite Has Been Resent",
      html: `
        <h2>🚀 RentFAX Invitation</h2>
        <p>You’ve been reinvited to join <strong>${orgId}</strong> as <strong>${invite.role}</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/invite?orgId=${orgId}&inviteId=${inviteRef.id}">
          Accept Invitation
        </a></p>
        <p>This invite will expire in 7 days.</p>
      `,
    });

    await adminDB.collection("auditLogs").add({
        type: "INVITE_RESENT",
        actorUid: decoded.uid,
        targetEmail: invite.email,
        orgId,
        role: invite.role,
        timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
