import { dbAdmin } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "25");
  const action = searchParams.get("action");
  const disputeId = searchParams.get("disputeId");

  try {
    let q: FirebaseFirestore.Query = dbAdmin.collection("auditLogs").orderBy("timestamp", "desc").limit(limit);

    if (action) q = q.where("action", "==", action);
    if (disputeId) q = q.where("disputeId", "==", disputeId);

    const snap = await q.get();
    const logs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("Error fetching audit logs:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
