
import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const inviteRef = adminDb.collection("beta_invites");
    
    // Check if the code already exists to prevent duplicates
    const snapshot = await inviteRef.where("code", "==", "RENTFAXBETA").get();
    if (!snapshot.empty) {
      return NextResponse.json({ message: "Invite code already exists." }, { status: 200 });
    }

    await inviteRef.add({
      code: "RENTFAXBETA",
      used: false,
      createdAt: Date.now(),
      createdBy: "system-init"
    });

    return NextResponse.json({ success: true, code: "RENTFAXBETA" }, { status: 201 });
  } catch (error) {
    console.error("Error creating invite code:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
