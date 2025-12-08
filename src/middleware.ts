import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";

// Routes that require SUPER_ADMIN role
const SUPERADMIN_PROTECTED = [
  "/superadmin-dashboard",
];

// Utility: check if path starts with a protected prefix
function isProtectedRoute(pathname: string) {
  return SUPERADMIN_PROTECTED.some((p) =>
    pathname.toLowerCase().startsWith(p.toLowerCase())
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If not a protected route, continue
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // Attempt to read Firebase Auth session cookie
  const sessionCookie = req.cookies.get("__session")?.value;

  if (!sessionCookie) {
    // Not authenticated → go to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify session cookie (server-side auth)
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    // Fetch user role from Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.redirect("/403");
    }

    const data = userDoc.data();
    const role = data?.role ?? "USER";

    // ⛔ Reject anyone who isn't SUPER_ADMIN
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect("/403");
    }

    // 🟢 Allow access
    return NextResponse.next();

  } catch (err) {
    console.error("Middleware error:", err);

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Enable middleware on all routes
export const config = {
  matcher: [
    "/superadmin-dashboard/:path*",
  ],
};
