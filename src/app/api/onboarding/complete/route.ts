import { adminDb, adminAuth } from "@/firebase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = cookies().get("__session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    const uid = decodedClaims.uid;

    const userRef = adminDb.collection("users").doc(uid);
    await userRef.update({ onboardingComplete: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
