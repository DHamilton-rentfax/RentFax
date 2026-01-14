import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ DEV BYPASS — local / cloud workstations
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  /**
   * ✅ Explicit public routes
   * Prevents accidental lockouts and future regressions
   */
  const publicPaths = [
    "/login",
    "/register",
    "/logout",
    "/api",
  ];

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /**
   * 🔒 Protected route prefixes
   */
  const protectedPrefixes = [
    "/superadmin",
    "/support",
    "/dashboard",
    "/renter",
  ];

  const isProtected = protectedPrefixes.some((p) =>
    pathname.startsWith(p)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  /**
   * 🍪 Session cookie check (Edge-safe)
   * ⚠️ DO NOT verify tokens here
   */
  const session = req.cookies.get("__session")?.value;

  if (!session) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const loginUrl = appUrl
      ? new URL("/login", appUrl)
      : new URL("/login", req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * 🎯 Middleware scope
 */
export const config = {
  matcher: [
    "/superadmin/:path*",
    "/support/:path*",
    "/dashboard/:path*",
    "/renter/:path*",
  ],
};
