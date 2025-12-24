import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { aiGenerateSupportReply } from "@/lib/ai/support";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { upsertBacklogFromSignal } from "@/lib/support/backlog";

export async function POST(req: NextRequest) {
  const { message, context, threadId } = await req.json();
  const role = getUserRoleFromHeaders(req.headers) || "UNKNOWN";

  await adminDb.collection("support_metrics").add({
    type: "CHAT_ESCALATION",
    query: message,
    context,
    userRole: role,
    createdAt: new Date(),
  });

  // New helper:
  await upsertBacklogFromSignal({
    sourceType: "CHAT",
    query: message,
    context,
    role,
  });

  let threadRef;

  // Create thread if not provided
  if (!threadId) {
    threadRef = await adminDb.collection("support_threads").add({
      userRole: role,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "open",
      context,
    });
  } else {
    threadRef = adminDb.collection("support_threads").doc(threadId);
    await threadRef.update({
      updatedAt: new Date(),
    });
  }

  // Add user message
  await threadRef.collection("messages").add({
    sender: "user",
    senderRole: role,
    text: message,
    createdAt: new Date(),
    source: "chat",
  });

  // AI response
  const reply = await aiGenerateSupportReply({
    message,
    role,
    context,
  });

  await threadRef.collection("messages").add({
    sender: "bot",
    senderRole: "SYSTEM",
    text: reply,
    createdAt: new Date(),
    source: "ai",
  });

  await threadRef.update({
    lastMessage: reply,
    lastMessageAt: new Date(),
  });

  return NextResponse.json({
    reply,
    threadId: threadRef.id,
  });
}
