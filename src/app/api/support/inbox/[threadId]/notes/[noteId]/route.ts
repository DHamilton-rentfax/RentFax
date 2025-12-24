import { adminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { threadId: string, noteId: string } }) {
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
