import { NextResponse } from 'next/server';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { dbAdmin } from '@/lib/firebase-admin';

export async function GET() {
  const disputesSnap = await getCountFromServer(collection(dbAdmin, 'disputes'));
  const usersSnap = await getCountFromServer(collection(dbAdmin, 'users'));
  const logsSnap = await getCountFromServer(collection(dbAdmin, 'systemLogs'));
  const fraudSnap = await getDocs(query(collection(dbAdmin, 'renters'), where('alert', '==', true)));

  return NextResponse.json({
    totalDisputes: disputesSnap.data().count,
    totalUsers: usersSnap.data().count,
    totalLogs: logsSnap.data().count,
    fraudAlerts: fraudSnap.size,
  });
}
