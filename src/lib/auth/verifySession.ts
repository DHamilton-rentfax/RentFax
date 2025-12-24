import { cookies } from "next/headers";
import { adminDb, adminAuth } from "@/firebase/server";

export async function verifySession(req: any) {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return null;

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userSnap = await adminDb.collection("users").doc(decoded.uid).get();

    if (!userSnap.exists) return null;

    const user = userSnap.data();

    return {
      uid: decoded.uid,
      email: decoded.email,
      role: user.role,
      companyId: user.companyId ?? null,
      onboardingCompleted: user.onboardingCompleted ?? false,
    };
  } catch {
    return null;
  }
}