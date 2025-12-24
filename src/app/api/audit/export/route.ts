import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { stringify } from "csv-stringify/sync";

export async function GET(req: NextRequest) {
  const role = await getUserRoleFromHeaders(req.headers);
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // This is a simplified example. In a real-world scenario, you'd stream the data
  // and apply the same filters as the search API.
  const snap = await adminDb
    .collection("audit_logs")
    .orderBy("timestamp", "desc")
    .limit(5000) // Adjust limit as needed for performance
    .get();

  const rows = snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      timestamp: data.timestamp.toDate(), // Convert Firestore timestamp to JS Date
      metadata: JSON.stringify(data.metadata), // Flatten metadata for CSV
    };
  });

  const csv = stringify(rows, {
    header: true,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="audit_logs.csv"',
    },
  });
}
