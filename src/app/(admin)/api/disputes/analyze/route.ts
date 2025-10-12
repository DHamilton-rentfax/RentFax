import { NextResponse } from 'next/server'
import { aiDisputeResolver } from '@/ai/flows/ai-dispute-resolver'
import { db } from '@/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

export async function POST(req: Request) {
  const { dispute } = await req.json()

  // Fetch linked report (optional)
  let reportData: any = null
  try {
    const snap = await getDoc(doc(db, 'reports', dispute.reportId))
    if (snap.exists()) reportData = snap.data()
  } catch (e) {
    console.warn('Report lookup failed', e)
  }

  const analysis = await aiDisputeResolver(dispute, reportData)
  return NextResponse.json(analysis)
}
