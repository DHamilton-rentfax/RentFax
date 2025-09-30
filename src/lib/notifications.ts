'use server';
import { sendEmail } from './email';
import { dbAdmin as db } from '@/lib/firebase-admin';

// A simple routing and data-fetching layer for notifications
// This keeps notification logic out of the main business logic flows.

interface Notification {
  recipientId: string;
  templateId: string;
  data: Record<string, any>;
}

// Map of template IDs to their respective handlers
const notificationHandlers: Record<string, (data: any) => Promise<any>> = {
  new_renter_application: async (data) => {
    // 1. Fetch property manager for the unit
    const listingDoc = await db.doc(`listings/${data.listingId}`).get();
    const listing = listingDoc.data();
    if (!listing) throw new Error('Listing not found for notification');

    const managerDoc = await db.doc(`users/${listing.propertyManagerId}`).get();
    const manager = managerDoc.data();
    if (!manager || !manager.email) throw new Error('Manager not found or has no email');

    // 2. Send email
    return sendEmail({
      to: manager.email,
      subject: `New Application for ${listing.title}`,
      html: `<p>You have a new rental application from <strong>${data.applicantName}</strong> for the property at <strong>${listing.address}</strong>.</p><p>Please log in to your dashboard to review it.</p>`,
    });
  },
  
  application_status_changed: async (data) => {
    const renterDoc = await db.doc(`users/${data.renterId}`).get();
    const renter = renterDoc.data();
    if(!renter || !renter.email) throw new Error('Renter not found for notification');

    return sendEmail({
        to: renter.email,
        subject: `Update on Your Rental Application`,
        html: `<p>Hi ${renter.name},</p><p>There has been an update on your application for the property at <strong>${data.listingAddress}</strong>. Your new status is: <strong>${data.newStatus.toUpperCase()}</strong>.</p><p>You can view more details in your renter dashboard.</p>`
    });
  }
};

/**
 * Sends a notification by routing it to the correct handler.
 * @param notification - The notification object.
 */
export async function sendNotification(notification: Notification) {
  const handler = notificationHandlers[notification.templateId];

  if (!handler) {
    console.error(`No notification handler found for templateId: ${notification.templateId}`);
    return;
  }

  try {
    await handler(notification.data);
    console.log(`Notification sent successfully for template: ${notification.templateId}`);
  } catch (error) {
    console.error(`Failed to send notification for template: ${notification.templateId}`, error);
    // Optionally, add more robust error handling (e.g., retry logic, logging to a service)
  }
}
