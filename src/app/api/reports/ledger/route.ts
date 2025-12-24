import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

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

export async function GET(req: Request) {
  const uid = await getUidFromRequest(req);
  if (!uid) return jsonError("UNAUTHORIZED", "You must be signed in.", 401);

  const url = new URL(req.url);
  const renterId = String(url.searchParams.get("renterId") || "").trim();
  if (!renterId) return jsonError("BAD_REQUEST", "Missing renterId.");

  // Load user -> org
  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) return jsonError("UNAUTHORIZED", "User record not found.", 401);

  const user = userSnap.data() as any;
  const orgId = String(user.orgId || "").trim();
  const role = String(user.role || "").trim();

  const allowedRoles = new Set(["OWNER", "ADMIN", "MANAGER"]);
  if (!orgId || !allowedRoles.has(role)) {
    return jsonError("UNAUTHORIZED", "Insufficient permissions.", 403);
  }

  // Renter must be verified
  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  if (!renterSnap.exists) return jsonError("NOT_FOUND", "Renter not found.", 404);
  const renter = renterSnap.data() as any;

  if (renter?.verification?.status !== "verified") {
    return jsonError("RENTER_NOT_VERIFIED", "Renter must be verified first.", 400);
  }

  // Entitlement check (org must have active entitlement)
  const entitlementId = `${orgId}_${renterId}`;
  const entSnap = await adminDb.collection("entitlements").doc(entitlementId).get();

  if (!entSnap.exists || (entSnap.data() as any)?.status !== "active") {
    return jsonError(
      "PAYMENT_REQUIRED",
      "Access requires $20 or a credit.",
      402
    );
  }

  // Fetch ledger reports for renter (all orgs’ reports)
  const reportsSnap = await adminDb
    .collection("reports")
    .where("renterId", "==", renterId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const reports = reportsSnap.docs.map((d) => {
    const data = d.data() as any;

    // IMPORTANT: return only what you want companies to see.
    // (You can later hide certain fields until purchase level is higher.)
    return {
      reportId: d.id,
      renterId: data.renterId,
      orgId: data.orgId,
      status: data.status,
      createdAt: data.createdAt,
      submittedAt: data.submittedAt ?? null,
      incidentsCount: Array.isArray(data.incidents) ? data.incidents.length : 0,
      verificationSnapshot: data.verificationSnapshot ?? null,
    };
  });

  // Audit log: report_view
  await adminDb.collection("accessLogs").add({
    renterId,
    orgId,
    userId: uid,
    action: "ledger_view",
    createdAt: new Date(),
  });

  return NextResponse.json({
    ok: true,
    renter: {
      renterId,
      fullName: renter.fullName ?? null,
      address: renter.address ?? null,
      verification: renter.verification ?? null,
    },
    reports,
  });
}
