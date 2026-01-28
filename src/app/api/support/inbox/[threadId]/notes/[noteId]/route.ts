import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { threadId: string, noteId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const role = getUserRoleFromHeaders(req.headers);

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await adminDb
    .collection("support_threads")
    .doc(params.threadId)
    .collection("internal_notes")
    .doc(params.noteId)
    .delete();

  return NextResponse.json({ success: true });
}
