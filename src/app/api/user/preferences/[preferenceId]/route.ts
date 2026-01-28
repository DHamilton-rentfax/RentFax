
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { requireAuth } from "@/lib/auth-middleware";
import { Timestamp } from "firebase-admin/firestore";

export const GET = requireAuth(async (_req, user, { params }) => {
  const { preferenceId } = params;

  const ref = adminDb
    .collection("users")
    .doc(user.uid)
    .collection("preferences")
    .doc(preferenceId);

  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Preference not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: snap.id,
    ...snap.data(),
  });
});

export const PATCH = requireAuth(async (req, user, { params }) => {
  const { preferenceId } = params;
  const body = await req.json();

  const ref = adminDb
    .collection("users")
    .doc(user.uid)
    .collection("preferences")
    .doc(preferenceId);

  await ref.set(
    {
      ...body,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );

  return NextResponse.json({ success: true });
});
