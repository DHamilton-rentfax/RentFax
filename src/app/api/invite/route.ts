import { NextResponse } from "next/server";
import { adminDb as adminDb } from "@/firebase/server";
import { v4 as uuidv4 } from "uuid";

const seatLimits: { [key: string]: number } = {
  free: 0,
  starter: 1,
  pro: 5,
  enterprise: Infinity,
};

export async function POST(req: Request) {
  try {
    const { email, role, teamId, invitedBy } = await req.json();

    // For customer teams, enforce seat limits
    if (teamId !== "internalTeam") {
      const teamRef = adminDb.collection("teams").doc(teamId);
      const teamSnap = await teamRef.get();

      if (!teamSnap.exists) {
        return NextResponse.json(
          { success: false, error: "Team not found" },
          { status: 404 },
        );
      }

      const team = teamSnap.data();
      const plan = team.plan || "free";
      const limit = seatLimits[plan];

      const membersSnap = await teamRef.collection("members").get();
      const currentMembers = membersSnap.size;

      if (currentMembers >= limit) {
        return NextResponse.json(
          {
            success: false,
            error: `Team has reached its ${limit}-seat limit.`,
          },
          { status: 403 },
        );
      }
    }

    const inviteId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create the invite document
    await adminDb.collection("invites").doc(inviteId).set({
      email,
      role,
      teamId,
      invitedBy,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    // Log the invite action for auditing
    await adminDb.collection("auditLogs").add({
      action: "INVITE_SENT",
      by: invitedBy,
      invitee: email,
      role,
      teamId,
      createdAt: new Date().toISOString(),
    });

    console.log(`📨 Invite email sent to ${email} for team ${teamId}`);

    return NextResponse.json({ success: true, inviteId });
  } catch (err) {
    console.error("Error creating invite", err);
    return NextResponse.json(
      { success: false, error: "Failed to create invite" },
      { status: 500 },
    );
  }
}
