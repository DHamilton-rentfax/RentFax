import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserIdFromHeaders } from "@/lib/auth/roles";

export async function POST(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const uid = await getUserIdFromHeaders(req.headers);
  if (!uid) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const ref = adminDb.collection("notifications").doc(params.notificationId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const notification = snap.data() as any;

  if (notification.userId !== uid) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await ref.update({
    readAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
