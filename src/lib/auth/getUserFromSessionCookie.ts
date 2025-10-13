// src/lib/auth/getUserFromSessionCookie.ts
"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/server";

export async function getUserFromSessionCookie() {
  const sessionCookie = cookies().get("__session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}
