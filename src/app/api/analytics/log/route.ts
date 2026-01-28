import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    const { event, reportId } = await req.json();

    if (!event || !reportId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    await adminDb.collection("analyticsEvents").add({
      orgId: decoded.orgId,
      userId: decoded.uid,
      event,
      reportId,
      ts: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
