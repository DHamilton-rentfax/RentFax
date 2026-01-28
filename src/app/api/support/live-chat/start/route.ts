import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { userId, userRole } = await req.json();

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const existing = await adminDb
    .collection("liveChatConversations")
    .where("userId", "==", userId)
    .where("status", "!=", "closed")
    .get();

  if (!existing.empty) {
    return NextResponse.json({ conversationId: existing.docs[0].id });
  }

  const ref = adminDb.collection("liveChatConversations").doc();
  const now = new Date();

  await ref.set({
    id: ref.id,
    userId,
    userRole,
    status: "open",
    createdAt: now,
    updatedAt: now,
    lastMessage: "Conversation started",
    lastMessageAt: now,
  });

  return NextResponse.json({ conversationId: ref.id });
}
