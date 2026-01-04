
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { requireAuth } from "@/lib/auth-middleware";
import { Timestamp } from "firebase-admin/firestore";

export const GET = requireAuth(async (_req, user, { params }) => {
  const { verificationId } = params;

  if (!["ADMIN", "SUPER_ADMIN"].includes(user.claims.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const snap = await adminDb
    .collection("verifications")
    .doc(verificationId)
    .get();

  if (!snap.exists) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: snap.id,
    ...snap.data(),
  });
});

export const PATCH = requireAuth(async (req, user, { params }) => {
  const { verificationId } = params;

  if (!["ADMIN", "SUPER_ADMIN"].includes(user.claims.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status, notes } = body;

  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const ref = adminDb.collection("verifications").doc(verificationId);

  await ref.update({
    status,
    notes: notes || null,
    reviewedBy: user.uid,
    reviewedAt: Timestamp.now(),
  });

  await adminDb.collection("audit_logs").add({
    action: "VERIFICATION_REVIEWED",
    actorId: user.uid,
    actorRole: user.claims.role,
    targetType: "VERIFICATION",
    targetId: verificationId,
    metadata: { status },
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ success: true });
});
