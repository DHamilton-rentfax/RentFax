import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not set. Emails will not be sent.');
}

const db = admin.firestore();

export const notifyRenterOfIncident = functions.firestore
  .document('renters/{renterId}/incidents/{incidentId}')
  .onCreate(async (snap, context) => {
    const incident = snap.data();
    if (!incident) {
      console.log('No incident data found.');
      return;
    }

    const { renterId } = context.params;

    // Get the renter's data to find their email
    const renterSnap = await db.doc(`renters/${renterId}`).get();
    const renter = renterSnap.data();

    if (!renter || !renter.email) {
      console.log(`Renter or renter email not found for renterId: ${renterId}`);
      return;
    }

    const msg = {
      to: renter.email,
      from: { email: 'alerts@rentfax.ai', name: 'RentFAX Alerts' },
      subject: `New Incident Reported: ${incident.type}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Incident Report</h2>
          <p>Hello ${renter.name || 'Renter'},</p>
          <p>A new incident has been reported on your RentFAX profile by your property manager.</p>
          
          <h3>Incident Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${incident.type}</li>
            <li><strong>Description:</strong> ${incident.description || '(none provided)'}</li>
            <li><strong>Date Reported:</strong> ${incident.createdAt.toDate().toLocaleDateString()}</li>
          </ul>

          <p>
            If you believe this is an error, you can dispute this incident through your Renter Portal.
          </p>

          <a 
            href="${process.env.NEXT_PUBLIC_APP_URL}/renter/portal"
            style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;"
          >
            Go to My Portal
          </a>
          
          <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send(msg);
        console.log(`Incident notification email sent to ${renter.email}`);
      } else {
        console.log('Skipping email send because SENDGRID_API_KEY is not set.');
      }
    } catch (error: any) {
      console.error('Failed to send incident notification email', error.toString());
    }
  });
