
import { adminDb, adminAuth } from "@/firebase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const session = cookies().get("__session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    const uid = decodedClaims.uid;
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.update({ onboardingComplete: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // The session cookie is invalid or expired. Force the user to log in again.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

