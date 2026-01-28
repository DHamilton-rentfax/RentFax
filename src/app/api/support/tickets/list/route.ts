import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const snapshot = await adminDb
      .collection("supportTickets")
      .orderBy("lastMessageAt", "desc")
      .get();

    const tickets = snapshot.docs.map((d) => d.data());
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
