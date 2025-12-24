'use server';

import { adminDb } from '@/firebase/server';

export async function logPartnerUsage({
  partnerOrgId,
  partnerType,
  partnerUid,
  eventType,
  caseId,
}: {
  partnerOrgId: string;
  partnerType: string;
  partnerUid: string;
  eventType: string;
  caseId: string;
}) {
  await adminDb.collection('partner_usage_logs').add({
    partnerOrgId,
    partnerType,
    partnerUid,
    eventType,
    caseId,
    timestamp: new Date(),
  });
}
