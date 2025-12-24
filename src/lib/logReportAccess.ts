import { adminDb } from '@/firebase/server'

export async function logReportAccess(params: {
  viewerId: string
  viewerType: 'INDIVIDUAL' | 'COMPANY' | 'PARTNER'
  renterId: string
  reportId: string
  reportType: 'BASIC' | 'FULL'
  paymentType: 'ONE_OFF' | 'SUBSCRIPTION' | 'PARTNER'
  viewerOrgId?: string
}) {
  await adminDb.collection('report_access_logs').add({
    ...params,
    createdAt: new Date(),
  })
}
