
import { NextResponse } from "next/server";
import { dbAdmin as adminDB } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    if (decoded.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snap = await adminDB
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();

    const reports = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
