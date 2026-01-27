import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { toCSV } from "@/lib/server/csv";

export async function GET(req: NextRequest) {
  const role = await getUserRoleFromHeaders(req.headers);
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const snap = await adminDb
    .collection("audit_logs")
    .orderBy("timestamp", "desc")
    .limit(5000)
    .get();

  const rows = snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      timestamp: data.timestamp.toDate(),
      metadata: JSON.stringify(data.metadata),
    };
  });

  const csv = toCSV(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="audit_logs.csv"',
    },
  });
}
