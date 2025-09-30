
'use server';

import { adminDB } from '@/firebase/server';

export interface AuditLog {
  id: string;
  action: string;
  notes: string;
  adminUserId: string;
  timestamp: Date;
}

/**
 * Fetches the historical audit trail for a specific dispute.
 * @param disputeId The ID of the dispute.
 * @returns An object containing an array of audit logs, or an error.
 */
export async function getDisputeHistory(disputeId: string) {
  try {
    const historySnapshot = await adminDB
      .collection('disputes')
      .doc(disputeId)
      .collection('history')
      .orderBy('timestamp', 'desc')
      .get();

    const history = historySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate(),
      } as AuditLog;
    });

    return { history };
  } catch (error) {
    console.error(`Error fetching history for dispute ${disputeId}:`, error);
    return { error: 'Failed to fetch audit history.' };
  }
}
