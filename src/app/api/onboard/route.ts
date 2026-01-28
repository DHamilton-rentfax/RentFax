import { getAdminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { accountType } = await req.json();

  if (!['business', 'individual'].includes(accountType)) {
    return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
  }

  try {
    const session = cookies().get("__session")?.value || "";
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    const uid = decodedClaims.uid;

    const userRef = adminDb.collection("users").doc(uid);

    // Set the account type and initial onboarding status
    await userRef.set({
      accountType: accountType,
      onboardingComplete: false,
    }, { merge: true });

    // If it's a business account, create the organization structure
    if (accountType === 'business') {
      const orgRef = await adminDb.collection("organizations").add({
        name: "New Organization", // Default name, user can change later
        ownerUid: uid,
        createdAt: Date.now(),
      });

      await adminDb.collection("organization_members").add({
        orgId: orgRef.id,
        uid: uid,
        role: "owner",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in onboarding API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
