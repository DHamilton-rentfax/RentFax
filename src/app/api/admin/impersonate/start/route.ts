import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await adminAuth.verifyIdToken(
    authHeader.replace("Bearer ", "")
  );

  if (!["SUPER_ADMIN", "ADMIN"].includes(decoded.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const orgId = body?.orgId;
  const reason = body?.reason || "Admin support";

  if (!orgId || typeof orgId !== "string") {
    return NextResponse.json(
      { error: "Invalid orgId" },
      { status: 400 }
    );
  }

  // Verify org exists
  const orgRef = adminDb.collection("orgs").doc(orgId);
  const orgSnap = await orgRef.get();
  if (!orgSnap.exists) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  const now = Timestamp.now();
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + 15 * 60 * 1000)
  );

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // 🔒 Transaction for atomic safety
  await adminDb.runTransaction(async (tx) => {
    const activeSnap = await tx.get(
      adminDb
        .collection("adminImpersonationSessions")
        .where("adminId", "==", decoded.uid)
        .where("active", "==", true)
    );

    activeSnap.forEach((doc) => {
      tx.update(doc.ref, { active: false, exitedAt: now });
    });

    tx.set(
      adminDb.collection("adminImpersonationSessions").doc(),
      {
        adminId: decoded.uid,
        orgId,
        reason,
        startedAt: now,
        expiresAt,
        active: true,
        ip,
      }
    );
  });

  return NextResponse.json({ success: true });
}
