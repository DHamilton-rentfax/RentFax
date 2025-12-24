import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snapshot = await adminDb
    .collection("liveChatConversations")
    .orderBy("lastMessageAt", "desc")
    .get();

  return NextResponse.json({
    conversations: snapshot.docs.map((d) => d.data()),
  });
}
