
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
 * @param id The ID of the dispute.
 * @returns An object containing an array of audit logs, or an error.
 */
export async function getDisputeHistory(id: string) {
  try {
    const historySnapshot = await adminDB
      .collection('disputes')
      .doc(id)
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
    if (error instanceof Error) {
      console.error(`Error fetching history for dispute ${id}:`, error.message);
    } else {
      console.error('Unknown error fetching history for dispute', id)
    }
    return { error: 'Failed to fetch audit history.' };
  }
}
