import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDB } from "@/firebase/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token!);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query: FirebaseFirestore.Query = adminDB.collection("auditLogs");

    if (startDate) query = query.where("timestamp", ">=", Number(startDate));
    if (endDate) query = query.where("timestamp", "<=", Number(endDate));

    query = query.orderBy("timestamp", "desc");

    const snapshot = await query.get();
    const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
