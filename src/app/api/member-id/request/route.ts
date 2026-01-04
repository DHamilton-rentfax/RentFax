import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { getEffectiveOrgId } from "@/lib/auth/getEffectiveOrgId";

const REQUEST_TTL_MINUTES = 15;

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(
    authHeader.replace("Bearer ", "")
  );

  // Resolve org context (supports impersonation)
  const orgId = await getEffectiveOrgId(
    decoded.uid,
    decoded.orgId
  );

  if (!orgId) {
    return NextResponse.json({ error: "Org context missing" }, { status: 400 });
  }

  const body = await req.json();
  const memberId = body?.memberId?.toUpperCase();
  const channel: "SMS" | "EMAIL" = body?.channel || "SMS";

  if (!memberId || typeof memberId !== "string") {
    return NextResponse.json(
      { error: "Invalid memberId" },
      { status: 400 }
    );
  }

  // 1️⃣ Lookup renter by Member ID
  const renterSnap = await adminDb
    .collection("renters")
    .where("memberId", "==", memberId)
    .where("memberIdStatus", "==", "ACTIVE")
    .limit(1)
    .get();

  if (renterSnap.empty) {
    return NextResponse.json(
      { error: "Member ID not found or inactive" },
      { status: 404 }
    );
  }

  const renterDoc = renterSnap.docs[0];
  const renter = renterDoc.data();
  const renterId = renterDoc.id;

  if (!renter.verified) {
    return NextResponse.json(
      { error: "Renter not verified" },
      { status: 403 }
    );
  }

  // Determine delivery target
  const deliveryTarget =
    channel === "SMS"
      ? renter.contact?.phone
      : renter.contact?.email;

  if (!deliveryTarget) {
    return NextResponse.json(
      { error: `Renter has no ${channel} on file` },
      { status: 400 }
    );
  }

  const now = Timestamp.now();
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + REQUEST_TTL_MINUTES * 60 * 1000)
  );

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // 2️⃣ Transaction: enforce single active request
  await adminDb.runTransaction(async (tx) => {
    const activeSnap = await tx.get(
      adminDb
        .collection("memberIdRequests")
        .where("renterId", "==", renterId)
        .where("orgId", "==", orgId)
        .where("status", "==", "PENDING")
    );

    activeSnap.forEach((doc) => {
      tx.update(doc.ref, { status: "EXPIRED" });
    });

    tx.set(
      adminDb.collection("memberIdRequests").doc(),
      {
        memberId,
        renterId,
        orgId,
        orgName: decoded.orgName || "Unknown Organization",
        status: "PENDING",
        requestedAt: now,
        expiresAt,
        channel,
        deliveryTarget,
        audit: {
          ip,
          userAgent: req.headers.get("user-agent") || "unknown",
        },
      }
    );
  });

  // 🔔 Trigger notification (async / fire-and-forget)
  // enqueueMemberIdNotification({ renterId, orgId, memberId, channel })

  return NextResponse.json({ success: true });
}
