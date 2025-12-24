import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { ticketId, staffId } = await req.json();

    if (!ticketId || !staffId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ticketRef = adminDb.collection("supportTickets").doc(ticketId);

    await ticketRef.update({
      assignedTo: staffId,
      status: "in_progress",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to assign ticket" }, { status: 500 });
  }
}
