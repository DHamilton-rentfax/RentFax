import { FieldValue } from "firebase-admin/firestore";

import { NextResponse } from "next/server";

import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const disputesSnap = await getCountFromServer(
    collection(adminDb, "disputes"),
  );
  const usersSnap = await getCountFromServer(collection(adminDb, "users"));
  const logsSnap = await getCountFromServer(collection(adminDb, "systemLogs"));
  const fraudSnap = await getDocs(
    query(collection(adminDb, "alerts"), where("type", "==", "FRAUD_ALERT")),
  );

  return NextResponse.json({
    totalDisputes: disputesSnap.data().count,
    totalUsers: usersSnap.data().count,
    totalLogs: logsSnap.data().count,
    fraudAlerts: fraudSnap.size,
  });
}
