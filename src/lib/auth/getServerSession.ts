// src/lib/auth/getServerSession.ts
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/firebase/server";

export type ServerSession = {
  uid: string;
  email: string | null;
  role: string;
  companyId: string | null;
};

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = cookies();
  const sessionCookie =
    cookieStore.get("__session")?.value ||
    cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const userSnap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!userSnap.exists) {
      return null;
    }

    const data = userSnap.data()!;

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: data.role ?? "USER",
      companyId: data.companyId ?? null,
    };
  } catch {
    return null;
  }
}