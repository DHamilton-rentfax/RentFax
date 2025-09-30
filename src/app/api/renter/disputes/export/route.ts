import { NextRequest, NextResponse } from 'next/server';
import { getDisputesForRenter } from '@/app/actions/get-disputes-for-renter';
import { adminAuth } from '@/firebase/server';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dispute } from '@/types/dispute';

export async function GET(req: NextRequest) {
  const session = await adminAuth.verifyIdToken(req.headers.get('Authorization')?.split('Bearer ')[1] || '');
  if (!session?.uid) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv'; // Default to csv

  const { disputes, error } = await getDisputesForRenter(session.uid);

  if (error) {
    return new NextResponse(error, { status: 500 });
  }

  if (format === 'csv') {
    const csv = Papa.unparse(disputes);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="disputes.csv"',
      },
    });
  } else if (format === 'pdf') {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [['ID', 'Reason', 'Created At']],
      body: disputes.map((d: Dispute) => [d.id, d.message, d.createdAt.toLocaleDateString()]),
    });
    const pdf = doc.output();
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="disputes.pdf"',
      },
    });
  }

  return new NextResponse('Invalid format', { status: 400 });
}
