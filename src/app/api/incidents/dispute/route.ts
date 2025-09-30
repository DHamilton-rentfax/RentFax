
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/server';

export async function POST(req: NextRequest) {
  try {
    const { incidentId, message, files } = await req.json();

    if (!incidentId || !message) {
      return new NextResponse('Missing incidentId or message', { status: 400 });
    }

    const dispute = {
      incidentId,
      message,
      files,
      createdAt: new Date(),
    };

    await db.collection('disputes').add(dispute);

    // Also update the incident status to 'disputed'
    await db.collection('incidents').doc(incidentId).update({ status: 'disputed' });

    return new NextResponse('Dispute submitted successfully', { status: 200 });
  } catch (error) {
    console.error('Error submitting dispute:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
