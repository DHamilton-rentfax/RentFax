
'use server';

import { adminDB } from '@/firebase/server';
import { revalidatePath } from 'next/cache';
import { sendDisputeStatusUpdateEmail } from '@/lib/emails/sendDisputeStatusUpdate';
import { getDisputeById } from './get-dispute-by-id';

interface UpdateDisputeStatusProps {
  disputeId: string;
  newStatus: 'approved' | 'rejected';
  adminNotes: string;
  adminUserId: string; // ID of the admin making the change
}

/**
 * Updates the status of a dispute, logs the action, and sends a notification email.
 * @param props The properties for updating the dispute status.
 * @returns An object indicating success or an error.
 */
export async function updateDisputeStatus(props: UpdateDisputeStatusProps) {
  const { disputeId, newStatus, adminNotes, adminUserId } = props;

  try {
    const disputeRef = adminDB.collection('disputes').doc(disputeId);

    // 1. Fetch the full dispute data to get renter info
    const { dispute, error } = await getDisputeById(disputeId);
    if (error || !dispute || !dispute.renter) {
      throw new Error(error || 'Dispute or renter not found.');
    }

    // 2. Update the dispute status
    await disputeRef.update({ 
      status: newStatus,
      updatedAt: new Date(),
    });

    // 3. Create an audit log entry
    const auditLogRef = adminDB.collection('disputes').doc(disputeId).collection('history').doc();
    await auditLogRef.set({
      action: `status_changed_to_${newStatus}`,
      notes: adminNotes,
      adminUserId,
      timestamp: new Date(),
    });
    
    // 4. If approved, you might want to update the original incident as well.
    // For example, marking it as 'resolved' or nullifying the amount.
    if (newStatus === 'approved' && dispute.incidentId) {
      const incidentRef = adminDB.collection('incidents').doc(dispute.incidentId);
      await incidentRef.update({ status: 'resolved_by_dispute' });
    }

    // 5. Send notification email to the renter
    await sendDisputeStatusUpdateEmail({
      email: dispute.renter.email,
      renterName: dispute.renter.name,
      disputeId,
      newStatus,
      adminNotes,
    });

    // 6. Revalidate paths to show updated status immediately
    revalidatePath(`/admin/disputes`);
    revalidatePath(`/admin/disputes/${disputeId}`);
    revalidatePath(`/renter/disputes`); // Assuming this is the renter's view

    return { success: true };

  } catch (err) {
    console.error(`Failed to update dispute ${disputeId}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
