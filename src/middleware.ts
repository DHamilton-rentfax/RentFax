
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import admin from "firebase-admin";

// ---------------------------------------------
// 1️⃣ Initialize Firebase Admin (server-side safe)
// ---------------------------------------------
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64, "base64").toString()
    : process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();

// ---------------------------------------------
// 2️⃣ Next-Intl locale setup
// ---------------------------------------------
const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
});

// ---------------------------------------------
// 3️⃣ Define plan-based route access
// ---------------------------------------------
const planAccess: Record<string, string[]> = {
  free: [],
  starter: ["/dashboard", "/reports"],
  pro: ["/dashboard", "/reports", "/ai-tools", "/billing"],
  enterprise: ["*"],
};

// ---------------------------------------------
// 4️⃣ Simple in-memory cache to avoid frequent Firestore reads
// ---------------------------------------------
const planCache = new Map<string, { plan: string; expires: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

async function getUserPlan(uid: string): Promise<string> {
  const now = Date.now();
  const cached = planCache.get(uid);
  if (cached && cached.expires > now) return cached.plan;

  try {
    const snap = await db.collection("users").doc(uid).get();
    const plan = snap.exists ? snap.data()?.plan || "free" : "free";
    planCache.set(uid, { plan, expires: now + CACHE_TTL_MS });
    return plan;
  } catch {
    return "free";
  }
}

// ---------------------------------------------
// 5️⃣ Middleware logic
// ---------------------------------------------
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets & Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|txt|xml)$/)
  ) {
    return intlMiddleware(request);
  }

  // --- Auth Check ---
  const userCookie = request.cookies.get("session")?.value;
  const uidCookie = request.cookies.get("uid")?.value; // optional cookie storing user ID

  // If trying to access admin without being logged in
  if (pathname.startsWith("/admin") && !userCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Plan Enforcement ---
  if (pathname.startsWith("/ai-tools") || pathname.startsWith("/billing")) {
    let plan = "free";

    if (uidCookie) {
      plan = await getUserPlan(uidCookie);
    }

    const allowedRoutes = planAccess[plan] || [];
    const hasAccess =
      allowedRoutes.includes("*") || allowedRoutes.some((p) => pathname.startsWith(p));

    if (!hasAccess) {
      const upgradeUrl = new URL("/upgrade", request.url);
      upgradeUrl.searchParams.set("required", "pro");
      return NextResponse.redirect(upgradeUrl);
    }
  }

  // ✅ Default: continue with locale handling
  return intlMiddleware(request);
}

// ---------------------------------------------
// 6️⃣ Middleware matcher
// ---------------------------------------------
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|api/stripe|api/webhook).*)",
  ],
};
