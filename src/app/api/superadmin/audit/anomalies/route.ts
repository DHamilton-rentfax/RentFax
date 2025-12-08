import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { detectAnomalies } from "@/lib/audit/detectAnomalies";

export async function GET() {
  try {
    const logsSnap = await adminDb
      .collection("auditLogs")
      .orderBy("timestamp", "desc")
      .limit(2000)
      .get();

    const logs = logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const insights = detectAnomalies(logs);

    return NextResponse.json({ insights });
  } catch (e: any) {
    console.error("ANOMALY ENGINE ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
