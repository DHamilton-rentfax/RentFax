import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const source = searchParams.get("source");

  try {
    let query = adminDB.collection("systemLogs").orderBy("timestamp", "desc");

    if (level) {
      query = query.where("level", "==", level);
    }

    if (source) {
      query = query.where("source", "==", source);
    }

    const snapshot = await query.limit(100).get();
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error("Error fetching system logs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch system logs." },
      { status: 500 },
    );
  }
}
