import { cookies } from "next/headers";
import { getAdminAuth } from "@/firebase/server";

export async function getCurrentUser() {
  const session = cookies().get("__session")?.value;
  if (!session) return null;

  const adminAuth = getAdminAuth();
  if (!adminAuth) return null;

  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}
