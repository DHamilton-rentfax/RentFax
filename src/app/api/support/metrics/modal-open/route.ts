import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { context, userRole } = await req.json();

    if (!context) {
      return new NextResponse('Missing context', { status: 400 });
    }

    await adminDb.collection("support_metrics").add({
      type: "HELP_MODAL_OPEN",
      context,
      userRole: userRole || 'anonymous',
      openedAt: new Date(),
    });

    return new NextResponse('Metric logged', { status: 200 });
  } catch (error) {
    console.error("Error logging support metric:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
