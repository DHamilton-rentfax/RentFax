import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const incidentId = new URL(req.url).searchParams.get("id");

  if (!incidentId) {
    return NextResponse.json({ error: "Missing incidentId" }, { status: 400 });
  }
  
  const snap = await adminDb.collection("incidents").doc(incidentId).get();

  if (!snap.exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ id: incidentId, ...snap.data() });
}
