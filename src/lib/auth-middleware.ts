// src/lib/auth-middleware.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/firebase/server";

export interface AuthedUser {
  uid: string;
  claims: Record<string, any>;
}

/**
 * Reads and verifies the Firebase session cookie (`__session`)
 */
export async function getUserFromSession(): Promise<AuthedUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) return null;

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      uid: decoded.uid,
      claims: decoded as Record<string, any>,
    };
  } catch (err) {
    console.error("Session verification failed:", err);
    return null;
  }
}

/**
 * Protects API routes by requiring a valid Firebase session cookie
 */
export function withAuth(
  handler: (
    req: NextRequest,
    user: AuthedUser
  ) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    return handler(req, user);
  };
}

// Backward compatibility
export const requireAuth = withAuth;
