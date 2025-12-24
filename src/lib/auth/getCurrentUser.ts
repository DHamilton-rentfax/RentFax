// src/lib/auth/getCurrentUser.ts
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/server";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    console.error("getCurrentUser verifySessionCookie error:", err);
    return null;
  }
}
