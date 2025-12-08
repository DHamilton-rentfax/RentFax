import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  try {
    const logsSnap = await adminDb
      .collection("auditLogs")
      .orderBy("timestamp", "desc")
      .limit(500)
      .get();

    const logs = logsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("AUDIT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
