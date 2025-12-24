import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { conversationId } = await req.json();

  const snapshot = await adminDb
    .collection("liveChatMessages")
    .where("conversationId", "==", conversationId)
    .orderBy("createdAt", "asc")
    .get();

  return NextResponse.json({
    messages: snapshot.docs.map((d) => d.data()),
  });
}
