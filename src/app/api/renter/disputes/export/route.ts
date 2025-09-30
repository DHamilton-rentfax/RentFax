import { NextRequest, NextResponse } from 'next/server';
import { getDisputesForRenter } from '@/app/actions/get-disputes-for-renter';
import { auth } from '@/lib/auth'; // Assuming you have an auth utility
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv'; // Default to csv

  const { disputes, error } = await getDisputesForRenter(session.user.id);

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
      head: [['ID', 'Reason', 'Status', 'Created At']],
      body: disputes.map(d => [d.id, d.reason, d.status, d.createdAt.toLocaleDateString()]),
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
