import { NextResponse } from 'next/server';
import { db } from '@/firebase/admin';

export async function GET() {
  try {
    const snap = await db.collection('demo_analytics').get();
    
    const stats = {
        demo_role_selected_renter: 0,
        demo_role_selected_company: 0,
        demo_renter_report_viewed: 0,
        demo_company_dashboard_viewed: 0,
    };

    snap.forEach((doc) => {
      const event = doc.data();
      if (event.eventName === 'demo_role_selected') {
        if (event.params.role === 'RENTER') {
          stats.demo_role_selected_renter++;
        } else if (event.params.role === 'COMPANY') {
          stats.demo_role_selected_company++;
        }
      } else if (event.eventName === 'demo_renter_report_viewed') {
        stats.demo_renter_report_viewed++;
      } else if (event.eventName === 'demo_company_dashboard_viewed') {
        stats.demo_company_dashboard_viewed++;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching demo analytics:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
