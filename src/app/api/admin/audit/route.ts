import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  // In a real app, you'd protect this route
  // with role-based access control.

  const logsSnapshot = await adminDb
    .collection("audit_logs")
    .orderBy("ts", "desc")
    .get();
    
  const logs = logsSnapshot.docs.map(doc => doc.data());
  return NextResponse.json(logs);
}
