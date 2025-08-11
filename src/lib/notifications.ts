'use server';
import * as admin from 'firebase-admin';
import { sendMail } from './email';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

// A simple routing and data-fetching layer for notifications
// This keeps notification logic out of the main business logic flows.

export async function safeNotify(payload: { type: string; [key: string]: any }) {
  try {
    switch (payload.type) {
      case 'dispute.opened':
        const company = await db.doc(`companies/${payload.companyId}`).get();
        const companyData = company.data();
        const companyEmail = companyData?.notificationEmail || process.env.COMPANY_NOTIF_EMAIL || 'team@example.com';
        
        await sendMail({
          to: companyEmail,
          subject: `New Dispute Opened: #${payload.disputeId}`,
          template: {
            name: 'disputeOpened',
            data: {
              disputeId: payload.disputeId,
              renterId: payload.renterId,
              incidentId: payload.incidentId,
              // You can add more template variables here, like a link to the dispute
            },
          },
        });
        break;

      case 'dispute.statusChanged':
        // Get renter to find their notification email.
        const renter = await db.doc(`renters/${payload.renterId}`).get();
        const renterData = renter.data();
        const renterEmail = renterData?.email || process.env.RENTER_NOTIF_FALLBACK || 'noreply@example.com';

        await sendMail({
            to: renterEmail,
            subject: `Update on your dispute: #${payload.disputeId}`,
            template: {
                name: 'disputeStatusChanged',
                data: {
                    disputeId: payload.disputeId,
                    newStatus: payload.status,
                }
            }
        });
        break;
      
      // Add more notification types here
      default:
        console.warn(`Unknown notification type: ${payload.type}`);
    }
  } catch (error) {
    console.error(`Failed to send notification for type ${payload.type}:`, error);
  }
}
