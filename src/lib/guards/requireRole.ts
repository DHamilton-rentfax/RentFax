"use server";

import { adminAuth, adminDB } from "@/firebase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireRole(
  roles: string[],
  sessionCookie?: string | null,
) {
  const cookie = sessionCookie ?? cookies().get("__session")?.value;
  if (!cookie) redirect("/login");

  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    if (!decoded.uid) redirect("/login");

    const userDoc = await adminDB.doc(`users/${decoded.uid}`).get();
    const user = userDoc.data();

    if (!user || !roles.includes(user.role)) {
      console.warn(
        `Blocked user ${decoded.email} from route requiring one of roles: ${roles.join(", ")}`,
      );
      redirect("/dashboard");
    }

    return { uid: decoded.uid, ...user };
  } catch (err) {
    console.error("Invalid or expired session cookie:", err);
    redirect("/login");
  }
}
