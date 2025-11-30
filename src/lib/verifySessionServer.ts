import { cookies } from "next/headers";

import { adminAuth } from "@/firebase/server";

export async function verifySessionServer() {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) return null;

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "USER",
      issuedAt: new Date(decoded.iat * 1000),
      expiresAt: new Date(decoded.exp * 1000),
    };
  } catch (error) {
    console.error("[Server Verify Error]", error);
    // Return null in case of expired cookie or other verification errors
    return null;
  }
}
