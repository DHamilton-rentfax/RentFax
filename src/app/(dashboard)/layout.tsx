import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminDb, adminAuth } from "@/firebase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("__session")?.value;
  if (!session) {
    redirect("/login");
  }

  let decodedClaims;
  try {
    decodedClaims = await adminAuth.verifySessionCookie(session, true /** checkRevoked */);
  } catch (error) {
    // Session cookie is invalid, expired, or revoked. Force login.
    redirect("/login");
  }

  const userSnap = await adminDb.collection("users").doc(decodedClaims.uid).get();
  const userData = userSnap.data();

  if (!userData) {
    // This is an edge case. The user is authenticated with Firebase, but their
    // user document doesn't exist in Firestore. This could happen if the user
    // was created but the Firestore document creation failed. Forcing a re-login
    // might not solve it. A more robust solution might involve creating the
    // document here or redirecting to an error page.
    // For now, we'll redirect to login as a safe default.
    redirect("/login");
    return;
  }

  if (!userData.onboardingComplete) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
