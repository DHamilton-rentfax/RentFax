import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, subject, message, category } = body;

    if (!uid || !subject || !message) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const ticketRef = adminDb.collection("supportTickets").doc();
    const messageRef = adminDb.collection("supportMessages").doc();

    const now = new Date();

    await ticketRef.set({
      id: ticketRef.id,
      createdAt: now,
      updatedAt: now,
      createdBy: uid,
      createdByRole: body.role ?? "UNKNOWN",
      subject,
      category,
      status: "open",
      lastMessage: message,
      lastMessageAt: now,
    });

    await messageRef.set({
      id: messageRef.id,
      ticketId: ticketRef.id,
      senderId: uid,
      senderRole: body.role ?? "UNKNOWN",
      message,
      createdAt: now,
    });

    return NextResponse.json({ ticketId: ticketRef.id });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
