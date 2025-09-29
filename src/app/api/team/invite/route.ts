import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { orgId, email, role } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    const inviteRef = adminDB.collection("orgs").doc(orgId).collection("invites").doc();
    await inviteRef.set({
      email,
      role,
      invitedBy: decoded.uid,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      status: "pending",
    });

    await sgMail.send({
      to: email,
      from: { email: "invites@rentfax.ai", name: "RentFAX" },
      subject: `You have been invited to join ${orgId} on RentFAX`,
      html: `
        <h2>🚀 RentFAX Invitation</h2>
        <p>You’ve been invited to join <strong>${orgId}</strong> as <strong>${role}</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/invite?orgId=${orgId}&inviteId=${inviteRef.id}">
          Accept Invitation
        </a></p>
        <p>This invite will expire in 7 days.</p>
      `,
    });

    await adminDB.collection("auditLogs").add({
      type: "INVITE_SENT",
      actorUid: decoded.uid,
      targetEmail: email,
      orgId,
      role,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true, inviteId: inviteRef.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
