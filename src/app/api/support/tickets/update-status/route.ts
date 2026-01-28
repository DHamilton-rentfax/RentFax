import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

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
