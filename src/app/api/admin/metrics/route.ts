import { dbAdmin as db } from '@/lib/firebase-admin';
import { collection, getCountFromServer } from 'firebase/firestore'
import { NextResponse } from 'next/server';

export async function GET() {
  const disputes = await getCountFromServer(collection(db, 'disputes'))
  const users = await getCountFromServer(collection(db, 'users'))
  const logs = await getCountFromServer(collection(db, 'systemLogs'))

  return Response.json({
    totalDisputes: disputes.data().count,
    totalUsers: users.data().count,
    totalLogs: logs.data().count,
  })
}
