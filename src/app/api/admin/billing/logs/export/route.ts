import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb.collection("billingLogs").orderBy("timestamp", "desc").get();

  let csv = "timestamp,userId,event,amount,credits,stripeObjectId\n";

  snap.forEach((doc) => {
    const d = doc.data();
    csv += `${d.timestamp},${d.userId},${d.event},${d.amount ?? ""},${d.credits ?? ""},${d.stripeObjectId ?? ""}\n`;
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=billing-logs.csv",
    },
  });
}
