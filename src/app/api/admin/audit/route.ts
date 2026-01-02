import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  // In a real app, you'd protect this route
  // with role-based access control.

  const logsSnapshot = await adminDb
    .collection("audit_logs")
    .orderBy("ts", "desc")
    .get();
    
  const logs = logsSnapshot.docs.map(doc => doc.data());
  return NextResponse.json(logs);
}
