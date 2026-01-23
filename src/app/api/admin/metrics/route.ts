import { NextResponse } from "next/server";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { adminDb } from "@/firebase/server";

export async function GET() {
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
