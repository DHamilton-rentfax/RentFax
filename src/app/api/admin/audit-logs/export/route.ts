import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDb as db } from "@/firebase/server";
export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const orgId = searchParams.get("orgId");
    const actorUid = searchParams.get("actorUid");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query: FirebaseFirestore.Query = db.collection("auditLogs");

    if (type) query = query.where("type", "==", type);
    if (orgId) query = query.where("orgId", "==", orgId);
    if (actorUid) query = query.where("actorUid", "==", actorUid);

    if (startDate) query = query.where("timestamp", ">=", Number(startDate));
    if (endDate) query = query.where("timestamp", "<=", Number(endDate));

    const snapshot = await query.orderBy("timestamp", "desc").get();

    const rows = snapshot.docs.map((doc) => {
      const d = doc.data();
      return [
        new Date(d.timestamp).toISOString(),
        d.orgId,
        d.type,
        d.actorUid,
        d.targetEmail || d.targetUid || "",
        d.role || "",
      ];
    });

    const header = ["Time", "Org", "Type", "Actor", "Target", "Role"];
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=audit-logs-full.csv",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
