import { adminDb } from "@/firebase/server";
import { getUserRoleFromHeaders, requireSupportRole } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";
import { upsertBacklogFromSignal } from "@/lib/support/backlog";

export async function POST(req: NextRequest, { params }: { params: { threadId: string } }) {
  const { threadId } = params;
  const role = getUserRoleFromHeaders(req.headers);

  // Only staff allowed
  if (!["SUPER_ADMIN", "SUPPORT_ADMIN"].includes(role)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { note, category, escalationLevel } = await req.json();

  const result = await adminDb
    .collection("support_threads")
    .doc(threadId)
    .collection("internal_notes")
    .add({
      note,
      category,
      escalationLevel: escalationLevel || "none",
      createdAt: new Date(),
      createdByRole: role,
    });

  const threadRef = adminDb.collection("support_threads").doc(threadId);
  if (escalationLevel === "super_admin") {
    await threadRef.update({ status: "needs_superadmin" });
  } else if (escalationLevel === "support_admin") {
    await threadRef.update({ status: "pending" });
  }

  if (category === "AI_correction" || category === "user_confusion") {
    await upsertBacklogFromSignal({
      sourceType: "NOTE",
      query: note,
      context: "support_internal_note",
      role: role || 'UNKNOWN',
    });
  }


  return NextResponse.json({ success: true, id: result.id });
}

export async function GET(req: NextRequest, { params }: { params: { threadId: string } }) {
  requireSupportRole(req); // Only staff allowed

  const snap = await adminDb
    .collection("support_threads")
    .doc(params.threadId)
    .collection("internal_notes")
    .orderBy("createdAt", "asc")
    .get();

  const notes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ notes });
}
