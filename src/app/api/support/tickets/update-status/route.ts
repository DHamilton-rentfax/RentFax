import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { ticketId, status } = await req.json();

    if (!ticketId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ticketRef = adminDb.collection("supportTickets").doc(ticketId);

    await ticketRef.update({
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
