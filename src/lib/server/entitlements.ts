import { adminDb } from '@/firebase/server'

export async function getReportEntitlement(params: {
  uid: string
  reportId: string
}) {
  const ref = adminDb.collection('users').doc(params.uid).collection('entitlements').doc(params.reportId)
  const snap = await ref.get()
  return snap.exists ? snap.data() : null
}

export function entitlementAllows(level: 'BASIC' | 'FULL', requested: 'BASIC' | 'FULL') {
  if (level === 'FULL') return true
  return requested === 'BASIC'
}
