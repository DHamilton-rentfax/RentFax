import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { authMiddleware } from "@/lib/auth-middleware";

export const POST = authMiddleware(async (req, { user }) => {
  const ref = adminDb.collection("renters").doc(user.uid).collection("notifications");
  const snap = await ref.get();

  const batch = adminDb.batch();
  snap.forEach((doc) => batch.update(doc.ref, { read: true }));

  await batch.commit();
  return NextResponse.json({ success: true });
});
