import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest, { params }: { params: { threadId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  requireSupportRole(req);
  const { threadId } = params;

  const threadSnap = await adminDb.collection("support_threads").doc(threadId).get();
  if (!threadSnap.exists) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const thread = { id: threadSnap.id, ...threadSnap.data() };

  const messagesSnap = await adminDb.collection("support_threads").doc(threadId).collection("messages").orderBy("createdAt", "asc").get();
  const messages = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ thread, messages });
}
