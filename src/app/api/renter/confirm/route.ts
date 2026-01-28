import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { hashConfirmationToken } from "@/lib/security/hashToken";

function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

type Body = {
  token: string;
  response: "yes" | "no";
};

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("BAD_REQUEST", "Invalid JSON.");
  }

  const token = String(body?.token || "").trim();
  const response = body?.response;

  if (!token) return jsonError("BAD_REQUEST", "Missing token.");
  if (response !== "yes" && response !== "no")
    return jsonError("BAD_REQUEST", "Invalid response.");

  const tokenHash = hashConfirmationToken(token);

  // Find confirmation doc by tokenHash
  const snap = await adminDb
    .collection("renterConfirmations")
    .where("tokenHash", "==", tokenHash)
    .limit(1)
    .get();

  if (snap.empty) {
    return jsonError("NOT_FOUND", "This confirmation link is invalid.", 404);
  }

  const doc = snap.docs[0];
  const confRef = doc.ref;
  const conf = doc.data() as any;

  const now = new Date();
  const expiresAt = conf?.expiresAt?.toDate?.() ?? null;

  if (conf?.status === "confirmed") {
    return NextResponse.json({ ok: true, status: "already_confirmed" });
  }

  if (expiresAt && expiresAt.getTime() < now.getTime()) {
    // mark expired (idempotent)
    await confRef.update({ status: "expired" });
    return jsonError("EXPIRED", "This confirmation link has expired.", 410);
  }

  const renterId = conf.renterId as string;
  const initiatedByOrgId = conf.initiatedByOrgId as string;

  // Transaction: confirm + log + flag verification if "no"
  await adminDb.runTransaction(async (tx) => {
    const fresh = await tx.get(confRef);
    if (!fresh.exists) throw new Error("CONFIRMATION_MISSING");

    const freshData = fresh.data() as any;
    const freshStatus = freshData?.status;
    if (freshStatus === "confirmed") return;

    const freshExpiresAt = freshData?.expiresAt?.toDate?.() ?? null;
    if (freshExpiresAt && freshExpiresAt.getTime() < now.getTime()) {
      tx.update(confRef, { status: "expired" });
      throw new Error("EXPIRED");
    }

    // Write confirmation
    tx.update(confRef, {
      status: "confirmed",
      response,
      confirmedAt: now,
      confirmedVia: "link",
    });

    // Update renter verification record (optional fields — safe even if absent)
    const renterRef = adminDb.collection("renters").doc(renterId);
    const renterSnap = await tx.get(renterRef);
    if (renterSnap.exists) {
      if (response === "yes") {
        tx.update(renterRef, {
          "verification.confirmedByRenter": true,
          "verification.confirmedAt": now,
        });
      } else {
        // Denial = high risk signal. Flag for review.
        tx.update(renterRef, {
          "verification.confirmedByRenter": false,
          "verification.deniedByRenter": true,
          "verification.deniedAt": now,
          "verification.flagged": true,
        });
      }
    }

    // Org abuse / risk signals (denials should count heavily)
    const orgRef = adminDb.collection("orgs").doc(initiatedByOrgId);
    const orgSnap = await tx.get(orgRef);
    if (orgSnap.exists && response === "no") {
      const current = orgSnap.data() as any;
      const denies = Number(current?.verificationDenials ?? 0);
      const abuse = Number(current?.abuseScore ?? 0);

      // Conservative: denial is strong signal
      const nextDenies = denies + 1;
      const nextAbuse = abuse + 15;

      tx.update(orgRef, {
        verificationDenials: nextDenies,
        abuseScore: nextAbuse,
        isRestricted: nextAbuse >= 80 ? true : current?.isRestricted ?? false,
        abuseUpdatedAt: now,
      });
    }

    // Audit log
    const logRef = adminDb.collection("accessLogs").doc();
    tx.set(logRef, {
      action: "renter_confirmation",
      renterId,
      orgId: initiatedByOrgId,
      response,
      createdAt: now,
    });
  });

  return NextResponse.json({ ok: true, status: "confirmed", response });
}
