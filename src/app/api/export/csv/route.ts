import { NextResponse } from "next/server";
import { Parser } from "json2csv";

import { adminDb } from "@/lib/firebase/server";
import { getUserFromSessionCookie } from "@/lib/auth/getUserFromSessionCookie";

export async function POST(req: Request) {
  try {
    const { exportType } = await req.json();
    if (!exportType) {
      return NextResponse.json({ error: "Missing exportType" }, { status: 400 });
    }

    const session = await getUserFromSessionCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, companyId } = session;

    // Define which Firestore collection to export
    const exportMap: Record<string, string> = {
      renters: "renters",
      searches: "searchStatus",
      incidents: "incidents",
      disputes: "disputes",
      reports: "reports",
    };

    const collectionName = exportMap[exportType];
    if (!collectionName) {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    let query: FirebaseFirestore.Query = adminDb.collection(collectionName);

    // Company-admin should only export their own company’s data
    if (role !== "SUPER_ADMIN" && companyId) {
      query = query.where("companyId", "==", companyId);
    }

    const snap = await query.get();
    const data = snap.docs.map((doc) => {
      const docData = doc.data();
      // Convert Firestore Timestamps to ISO strings for CSV
      Object.keys(docData).forEach(key => {
        if (docData[key]?.toDate) {
          docData[key] = docData[key].toDate().toISOString();
        }
      });
      return { id: doc.id, ...docData };
    });

    if (data.length === 0) {
      return NextResponse.json({ error: "No data to export for the given criteria." }, { status: 404 });
    }

    // Create CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${exportType}-${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (err: any) {
    console.error("CSV Export Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
