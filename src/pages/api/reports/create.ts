import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/lib/firebase/admin';
import { sendReportEmail } from '@/lib/email';

const db = admin.firestore();

/**
 * API handler for creating a renter report, saving it to Firestore, and sending an email notification.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { renterData } = req.body; // Assuming renterData is sent in the request body

    if (!renterData || !renterData.email) {
      return res.status(400).json({ error: 'Missing required renter data or email.' });
    }

    // 1. Create a new report document in Firestore
    const reportRef = await db.collection('reports').add({
      ...renterData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed',
    });

    const reportId = reportRef.id;
    const reportUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reports/${reportId}`;

    // 2. Send a confirmation email to the renter
    await sendReportEmail({
      to: renterData.email,
      reportUrl,
      reportId,
      renterName: renterData.firstName,
    });

    console.log(`Report ${reportId} created and email notification sent.`);

    res.status(201).json({ 
      message: 'Report created successfully', 
      reportId, 
      reportUrl 
    });

  } catch (error: any) {
    console.error('Error in /api/reports/create:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
