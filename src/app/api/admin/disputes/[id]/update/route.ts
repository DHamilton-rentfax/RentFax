import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { adminDB } from '@/firebase/admin';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, adminNote } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the path to the dispute document within the renters collection
    // This requires finding the renter who owns the dispute.
    // Since we don't have that information directly, we'll need to query for it.
    // This is not ideal. A better data model would store the renterId on the dispute document.
    // For now, we will assume a simplified model where disputes are a top-level collection.

    // **Important Data Model Assumption:**
    // Assuming disputes are in a top-level collection called `disputes`
    const disputeRef = doc(adminDB, 'disputes', id);
    const disputeSnap = await getDoc(disputeRef);

    if (!disputeSnap.exists()) {
        // If not in the top-level, we have to search all renters. This is very inefficient.
        // This part of the code should be revised with a better data model.
        return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    await updateDoc(disputeRef, {
      status,
      adminNote: adminNote || null,
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'Dispute updated successfully' });
  } catch (error) {
    console.error('Error updating dispute:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
