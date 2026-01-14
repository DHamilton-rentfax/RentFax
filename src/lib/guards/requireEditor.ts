import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/firebase/server";

export async function requireEditor() {
  const session = cookies().get("__session")?.value;

  if (!session) {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
      : "/login";
    redirect(loginUrl);
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    const userSnap = await adminDb.doc(`users/${decoded.uid}`).get();
    const user = userSnap.data();

    if (!user || user.role !== "EDITOR") {
      redirect("/unauthorized");
    }

    return { uid: decoded.uid, ...user };
  } catch {
    redirect("/login");
  }
}
