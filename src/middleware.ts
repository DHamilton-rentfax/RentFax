import { NextRequest, NextResponse } from "next/server";

const APP_DOMAIN = "app.rentfax.io";
const MARKETING_DOMAIN = "www.rentfax.io";
const MARKETING_DOMAINS = ["rentfax.io", MARKETING_DOMAIN];

const PUBLIC_PATH_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/api",
  "/login",
  "/register",
  "/logout",
  "/reset-password",
  "/post-auth",
];

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/superadmin",
  "/admin",
  "/staff",
  "/support",
  "/renter",
];

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  /**
   * 🧪 DEV / LOCAL / CLOUD WORKSTATION BYPASS
   */
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("cloudworkstations.dev")
  ) {
    return NextResponse.next();
  }

  const isAppDomain = host === APP_DOMAIN;
  const isMarketingDomain = MARKETING_DOMAINS.includes(host);
  const session = req.cookies.get("__session")?.value;

  const isPublicPath =
    pathname === "/" ||
    PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p));

  const isProtectedRoute = PROTECTED_PATH_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  /**
   * 🚫 Block app routes on marketing domains
   */
  if (isProtectedRoute && isMarketingDomain) {
    return NextResponse.redirect(
      new URL("/", `https://${MARKETING_DOMAIN}`)
    );
  }

  /**
   * 🚫 Block marketing homepage on app domain
   */
  if (isAppDomain && pathname === "/") {
    return NextResponse.redirect(
      new URL("/post-auth", `https://${APP_DOMAIN}`)
    );
  }

  /**
   * 🍪 Session enforcement for protected app routes
   */
  if (isAppDomain && isProtectedRoute && !session) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, `https://${APP_DOMAIN}`)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
