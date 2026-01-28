
import { getAdminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { uid, email, accountType, inviteCode } = await req.json();

    if (!uid || !email || !accountType || !inviteCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the user document in Firestore
    await adminDb.collection("users").doc(uid).set({
      email,
      accountType,
      onboardingComplete: false,
      createdAt: Date.now(),
    });

    // Find the invite code and mark it as used
    const inviteQuery = await adminDb.collection("beta_invites").where("code", "==", inviteCode).limit(1).get();
    
    if (!inviteQuery.empty) {
      const inviteDoc = inviteQuery.docs[0];
      await inviteDoc.ref.update({
        used: true,
        usedBy: uid,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in /api/users/create:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
