import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    const inviteId = searchParams.get("inviteId");

    if (!orgId || !inviteId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const inviteDoc = await adminDB
      .collection("orgs")
      .doc(orgId)
      .collection("invites")
      .doc(inviteId)
      .get();

    if (!inviteDoc.exists) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const invite = inviteDoc.data();
    if (invite?.status !== "pending") {
      return NextResponse.json({ error: "Invite already used or expired" }, { status: 400 });
    }

    return NextResponse.json({ invite });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
