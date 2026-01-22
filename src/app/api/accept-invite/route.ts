import "server-only";
import { NextResponse } from "next/server";
import { adminDB as adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const { inviteId, userId, email } = await req.json();

    const inviteRef = adminDb.collection("invites").doc(inviteId);
    const inviteSnap = await inviteRef.get();

    if (!inviteSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 },
      );
    }

    const invite = inviteSnap.data();
    if (invite.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Invite not valid" },
        { status: 400 },
      );
    }

    // Add member to team
    await adminDb
      .collection("teams")
      .doc(invite.teamId)
      .collection("members")
      .doc(userId)
      .set({
        email,
        role: invite.role,
        joinedAt: new Date().toISOString(),
        invitedBy: invite.invitedBy,
      });

    // Update invite
    await inviteRef.update({
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error accepting invite", err);
    return NextResponse.json(
      { success: false, error: "Failed to accept invite" },
      { status: 500 },
    );
  }
}
