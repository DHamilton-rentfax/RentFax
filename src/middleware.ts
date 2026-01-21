import { NextRequest, NextResponse } from "next/server";

const APP_DOMAIN = "app.rentfax.io";
const MARKETING_DOMAIN = "www.rentfax.io";
const MARKETING_DOMAINS = ["rentfax.io", MARKETING_DOMAIN];

const PUBLIC_APP_PATHS = [
  "/login",
  "/register",
  "/signup",
  "/reset-password",
  "/logout",
  "/confirm",
  "/accept-invite",
  "/acknowledge",
  "/post-auth",
];

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/superadmin",
  "/admin",
  "/staff",
  "/support",
  "/renter",
  "/company",
  "/agency",
];

const MARKETING_PATH_PREFIXES = [
  "/", // homepage
  "/pricing",
  "/how-it-works",
  "/blog",
  "/integrations",
  "/investors",
  "/landlords",
  "/security",
  "/trust",
  "/risk-score",
  "/methodology",
];

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("__session")?.value;

  /* --------------------------------------------
   * Dev / Local bypass
   * -------------------------------------------- */
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("cloudworkstations.dev")
  ) {
    return NextResponse.next();
  }

  const isAppDomain = host === APP_DOMAIN;
  const isMarketingDomain = MARKETING_DOMAINS.includes(host);

  /* --------------------------------------------
   * Block app routes on marketing domains
   * -------------------------------------------- */
  if (
    isMarketingDomain &&
    PROTECTED_PATH_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(
      new URL("/", `https://${MARKETING_DOMAIN}`)
    );
  }

  /* --------------------------------------------
   * Allow marketing routes on marketing domains
   * -------------------------------------------- */
  if (
    isMarketingDomain &&
    MARKETING_PATH_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  /* --------------------------------------------
   * Allow public auth routes on app domain
   * -------------------------------------------- */
  if (
    isAppDomain &&
    PUBLIC_APP_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  /* --------------------------------------------
   * Redirect logged-in users away from app root
   * -------------------------------------------- */
  if (isAppDomain && pathname === "/" && session) {
    return NextResponse.redirect(
      new URL("/post-auth", `https://${APP_DOMAIN}`)
    );
  }

  /* --------------------------------------------
   * Enforce auth on protected app routes
   * -------------------------------------------- */
  if (isAppDomain && !session) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, `https://${APP_DOMAIN}`)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
