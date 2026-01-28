import "server-only";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminAuth } from "@/firebase/server";

/* =========================
   TYPES
========================= */

export interface AuthedUser {
  uid: string;
  claims: Record<string, any>;
}

/* =========================
   SESSION RESOLVER
========================= */

export async function getUserFromSession(): Promise<AuthedUser | null> {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) return null;

    const adminAuth = getAdminAuth();
    if (!adminAuth) return null;

    const decoded = await adminAuth.verifySessionCookie(session, true);

    return {
      uid: decoded.uid,
      claims: decoded as Record<string, any>,
    };
  } catch (err) {
    console.error("Session verification failed:", err);
    return null;
  }
}

/* =========================
   API ROUTE WRAPPER
========================= */

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

/* =========================
   LEGACY / MIDDLEWARE API
   (THIS FIXES BUILD ERRORS)
========================= */

export function authMiddleware(req: NextRequest) {
  const session = req.cookies.get("__session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // IMPORTANT:
  // Middleware must return void to continue
  return;
}

// Backward compatibility aliases
export const requireAuth = withAuth;
