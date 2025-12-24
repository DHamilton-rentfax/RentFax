import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

type PaymentMethod = "credit" | "stripe";

function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

async function getUidFromRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (bearer) {
    try {
      const decoded = await adminAuth.verifyIdToken(bearer);
      return decoded.uid;
    } catch {
      return null;
    }
  }

  const cookie = req.headers.get("cookie") || "";
  const match =
    cookie.match(/(?:^|;\s*)__session=([^;]+)/) ||
    cookie.match(/(?:^|;\s*)session=([^;]+)/);

  if (!match?.[1]) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(decodeURIComponent(match[1]), true);
    return decoded.uid;
  } catch {
    return null;
  }
}

function dayKeyUTC(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req: Request) {
  const uid = await getUidFromRequest(req);
  if (!uid) return jsonError("UNAUTHORIZED", "You must be signed in.", 401);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError("BAD_REQUEST", "Invalid JSON body.");
  }

  const renterId = String(body?.renterId || "").trim();
  const paymentMethod = String(body?.paymentMethod || "").trim() as PaymentMethod;

  if (!renterId) return jsonError("BAD_REQUEST", "Missing renterId.");
  if (paymentMethod !== "credit" && paymentMethod !== "stripe") {
    return jsonError("BAD_REQUEST", "Invalid paymentMethod.");
  }

  // Load user
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) return jsonError("UNAUTHORIZED", "User record not found.", 401);

  const user = userSnap.data() as any;
  const orgId = String(user.orgId || "").trim();
  const role = String(user.role || "").trim();

  if (!orgId) return jsonError("UNAUTHORIZED", "User is not attached to an org.", 401);

  const allowedRoles = new Set(["OWNER", "ADMIN", "MANAGER"]);
  if (!allowedRoles.has(role)) {
    return jsonError("UNAUTHORIZED", "Insufficient permissions.", 403);
  }

  const renterRef = adminDb.collection("renters").doc(renterId);
  const orgRef = adminDb.collection("orgs").doc(orgId);
  const entitlementId = `${orgId}_${renterId}`;
  const entitlementRef = adminDb.collection("entitlements").doc(entitlementId);

  const day = dayKeyUTC();
  const usageRef = orgRef.collection("usageDaily").doc(day);

  const VIEW_PRICE_CENTS = 2000; // $20
  const ABUSE_THRESHOLD = 80;

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const [orgSnap2, renterSnap2, entSnap2, usageSnap2] = await Promise.all([
        tx.get(orgRef),
        tx.get(renterRef),
        tx.get(entitlementRef),
        tx.get(usageRef),
      ]);

      if (!orgSnap2.exists) return { ok: false as const, code: "ORG_MISSING" as const };
      if (!renterSnap2.exists) return { ok: false as const, code: "RENTER_MISSING" as const };

      const org2 = orgSnap2.data() as any;
      const renter2 = renterSnap2.data() as any;

      // Optional but recommended: Only allow viewing ledger after renter verified.
      // (Since your entire system says verification is mandatory.)
      if (renter2?.verification?.status !== "verified") {
        return { ok: false as const, code: "RENTER_NOT_VERIFIED" as const };
      }

      // If already entitled and active, no charge: idempotent
      if (entSnap2.exists) {
        const ent = entSnap2.data() as any;
        if (ent?.status === "active") {
          return { ok: true as const, alreadyHadAccess: true as const };
        }
      }

      // Restriction / abuse gates
      if (org2?.isRestricted === true) {
        return { ok: false as const, code: "ORG_RESTRICTED" as const };
      }

      const abuse = Number(org2?.abuseScore ?? 0);
      if (abuse >= ABUSE_THRESHOLD) {
        return { ok: false as const, code: "ORG_RESTRICTED" as const };
      }

      // Rate limit (daily entitlement purchases)
      const tier = String(org2?.trustTier || "unverified");
      const DAILY_ENTITLE_LIMIT =
        tier === "enterprise" ? 500 : tier === "verified" ? 150 : 50;

      const usage2 = usageSnap2.exists ? (usageSnap2.data() as any) : null;
      const used = Number(usage2?.entitlementsPurchased ?? 0);

      if (used >= DAILY_ENTITLE_LIMIT) {
        return { ok: false as const, code: "RATE_LIMITED" as const };
      }

      // Payment enforcement
      const creditsAvailable = Number(org2?.creditsAvailable ?? 0);

      if (paymentMethod === "credit") {
        if (creditsAvailable < 1) return { ok: false as const, code: "NO_CREDITS" as const };
        tx.update(orgRef, { creditsAvailable: creditsAvailable - 1 });
      }

      // Stripe placeholder (best practice: create checkout session and finalize on webhook)
      // For now, we allow "stripe" mode to create entitlement directly.
      // You should harden later to only activate on payment confirmation.

      tx.set(entitlementRef, {
        orgId,
        renterId,
        scope: "RENTAL_REPORT_VIEW",
        status: "active",
        purchase: {
          method: paymentMethod,
          pricePaidCents: paymentMethod === "credit" ? 0 : VIEW_PRICE_CENTS,
        },
        createdByUserId: uid,
        createdAt: new Date(),
      });

      // Update usage
      if (!usageSnap2.exists) {
        tx.set(usageRef, {
          day,
          entitlementsPurchased: 1,
          updatedAt: new Date(),
        });
      } else {
        tx.update(usageRef, {
          entitlementsPurchased: used + 1,
          updatedAt: new Date(),
        });
      }

      // Audit log
      const accessLogRef = adminDb.collection("accessLogs").doc();
      tx.set(accessLogRef, {
        renterId,
        orgId,
        userId: uid,
        action: "entitlement_purchase",
        paymentMethod,
        pricePaidCents: paymentMethod === "credit" ? 0 : VIEW_PRICE_CENTS,
        createdAt: new Date(),
      });

      return { ok: true as const, alreadyHadAccess: false as const };
    });

    if (!result.ok) {
      if (result.code === "RENTER_NOT_VERIFIED")
        return jsonError("RENTER_NOT_VERIFIED", "Renter must be verified first.", 400);
      if (result.code === "NO_CREDITS")
        return jsonError("NO_CREDITS", "No credits available.", 400);
      if (result.code === "RATE_LIMITED")
        return jsonError("RATE_LIMITED", "Daily limit reached.", 429);
      if (result.code === "ORG_RESTRICTED")
        return jsonError("ORG_RESTRICTED", "Org restricted.", 403);
      if (result.code === "RENTER_MISSING")
        return jsonError("NOT_FOUND", "Renter not found.", 404);

      return jsonError("UNKNOWN", "Could not create entitlement.", 500);
    }

    return NextResponse.json({
      ok: true,
      status: "active",
      alreadyHadAccess: result.alreadyHadAccess,
    });
  } catch (e: any) {
    return jsonError("UNKNOWN", e?.message || "Server error.", 500);
  }
}
