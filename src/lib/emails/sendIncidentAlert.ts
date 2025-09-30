
import sgMail from '@sendgrid/mail';

// Ensure the SendGrid API key is set.
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.');
}

interface IncidentAlertEmailProps {
  email: string;
  renterId: string;
  incidentId: string;
  type: string;
  description: string;
}

export async function sendIncidentAlertEmail({
  email,
  renterId,
  incidentId,
  type,
  description,
}: IncidentAlertEmailProps) {
  // Check if SendGrid is configured
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Skipping email: SENDGRID_API_KEY not set.');
    return;
  }

  const incidentViewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/renters/${renterId}/incidents`;

  const msg = {
    to: email,
    from: 'support@rentfax.co', // Must be a verified sender
    subject: `New Incident Reported: ${type}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>RentFAX Incident Alert</h2>
        <p>A new incident has been filed under your account:</p>
        <div style="border-left: 4px solid #ff4500; padding-left: 15px; margin: 20px 0;">
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Details:</strong> ${description}</p>
        </div>
        <p>
          Please log in to your dashboard to view the full details, including any evidence provided, and to submit a dispute if you disagree with the report.
        </p>
        <a 
          href="${incidentViewUrl}" 
          style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          View Incident Details
        </a>
        <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
          Disputes must be submitted within 30 days. For more information, please review our dispute policy.
        </p>
        <p style="font-size: 0.8em; color: #aaa; margin-top: 20px;">
          &copy; RentFAX Inc.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Incident alert email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send incident alert email:', error);
    // Optional: Add more robust error handling or retry logic here
  }
}
