import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
