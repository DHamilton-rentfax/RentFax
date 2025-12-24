import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { conversationId, senderId, senderRole, message } = await req.json();

  if (!conversationId || !senderId || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const msgRef = adminDb.collection("liveChatMessages").doc();
  const convRef = adminDb.collection("liveChatConversations").doc(conversationId);

  const now = new Date();

  await msgRef.set({
    id: msgRef.id,
    conversationId,
    senderId,
    senderRole,
    message,
    createdAt: now,
  });

  await convRef.update({
    lastMessage: message,
    lastMessageAt: now,
    updatedAt: now,
    status: "active",
  });

  // Run AI suggestion only for USER messages
  if (senderRole === "USER") {
    // We don't need to wait for this to finish
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/support/live-chat/ai-suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        messageId: msgRef.id,
        text: message,
      }),
    });
  }

  return NextResponse.json({ success: true });
}
