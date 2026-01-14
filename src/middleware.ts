import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // 🧪 DEV BYPASS — local & cloud workstations
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  const isAppDomain = host.startsWith("app.");
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    `${req.nextUrl.protocol}//${host}`;

  /**
   * 🧾 Always-allowed paths
   */
  const PUBLIC_PATH_PREFIXES = [
    "/_next",
    "/favicon.ico",
    "/api",
    "/login",
    "/register",
    "/logout",
    "/reset-password",
  ];

  if (PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /**
   * 🔒 Protected app routes
   */
  const PROTECTED_PATH_PREFIXES = [
    "/dashboard",
    "/superadmin",
    "/staff",
    "/support",
    "/renter",
  ];

  const isProtectedRoute = PROTECTED_PATH_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  /**
   * 🚫 Prevent app routes on marketing domains
   */
  if (!isAppDomain && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /**
   * 🚫 Prevent marketing homepage on app subdomain
   */
  if (isAppDomain && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", appBaseUrl));
  }

  /**
   * 🍪 Session cookie check (Edge-safe)
   */
  if (isProtectedRoute) {
    const session = req.cookies.get("__session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/login", appBaseUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
