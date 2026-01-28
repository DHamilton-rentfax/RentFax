import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { computeSuspicionScore } from "@/lib/audit/computeSuspicionScore";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const logsSnap = await adminDb
      .collection("auditLogs")
      .orderBy("timestamp", "desc")
      .limit(1000)
      .get();

    const logs = logsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    const suspicious = logs
      .map((l) => ({
        ...l,
        suspicionScore: computeSuspicionScore(l)
      }))
      .filter((l) => l.suspicionScore >= 70); // threshold

    return NextResponse.json({ suspicious });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
