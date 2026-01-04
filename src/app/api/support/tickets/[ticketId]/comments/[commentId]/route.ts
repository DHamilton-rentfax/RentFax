
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { requireAuth } from "@/lib/auth-middleware";
import { Timestamp } from "firebase-admin/firestore";

export const POST = requireAuth(async (req, user, { params }) => {
  const { ticketId, commentId } = params;
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const ticketRef = adminDb.collection("support_tickets").doc(ticketId);
  const ticketSnap = await ticketRef.get();

  if (!ticketSnap.exists) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  await ticketRef
    .collection("comments")
    .doc(commentId)
    .set({
      message,
      authorId: user.uid,
      authorRole: user.claims.role,
      createdAt: Timestamp.now(),
    });

  await adminDb.collection("audit_logs").add({
    action: "SUPPORT_COMMENT_ADDED",
    actorId: user.uid,
    actorRole: user.claims.role,
    targetType: "SUPPORT_TICKET",
    targetId: ticketId,
    createdAt: Timestamp.now(),
  });

  return NextResponse.json({ success: true });
});
