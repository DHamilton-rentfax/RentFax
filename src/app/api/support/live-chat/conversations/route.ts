import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snapshot = await adminDb
    .collection("liveChatConversations")
    .orderBy("lastMessageAt", "desc")
    .get();

  return NextResponse.json({
    conversations: snapshot.docs.map((d) => d.data()),
  });
}
