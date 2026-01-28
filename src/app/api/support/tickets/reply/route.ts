import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { ticketId, uid, role, message } = await req.json();

    if (!ticketId || !uid || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const msgRef = adminDb.collection("supportMessages").doc();
    const ticketRef = adminDb.collection("supportTickets").doc(ticketId);

    const now = new Date();

    await msgRef.set({
      id: msgRef.id,
      ticketId,
      senderId: uid,
      senderRole: role,
      message,
      createdAt: now,
    });

    await ticketRef.update({
      updatedAt: now,
      lastMessage: message,
      lastMessageAt: now,
      status: "in_progress",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
