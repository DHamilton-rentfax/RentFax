import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const { ticketId } = await req.json();

  if (!ticketId) return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });

  const ticket = await adminDb.collection("supportTickets").doc(ticketId).get();
  if (!ticket.exists) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const messagesSnap = await adminDb
    .collection("supportMessages")
    .where("ticketId", "==", ticketId)
    .orderBy("createdAt", "asc")
    .get();

  const messages = messagesSnap.docs.map((d) => d.data());

  return NextResponse.json({ ticket: ticket.data(), messages });
}
