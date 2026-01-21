
// In a real application, this would use a service like Resend, SendGrid, or Twilio.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface EmailDetails {
  subject: string;
  body: string;
}

function getEmailContent(actionType: 'NO' | 'FRAUD', token: string): EmailDetails {
  const confirmationUrl = `${BASE_URL}/confirm/${token}`;

  if (actionType === 'NO') {
    return {
      subject: "Please Confirm Your Action - RentFAX",
      body: `
        <p>Hello,</p>
        <p>You recently indicated that you are <strong>not renting from a company</strong> on the RentFAX platform.</p>
        <p>To finalize this, please click the link below. This link is valid for 15 minutes.</p>
        <p><a href="${confirmationUrl}" style="font-weight: bold;">Confirm Action: Not Renting</a></p>
        <p>If you did not initiate this action, please ignore this email. No changes will be made.</p>
        <p>Thank you,<br/>The RentFAX Team</p>
      `
    };
  }

  // actionType === 'FRAUD'
  return {
    subject: "URGENT: Please Confirm Fraud Report - RentFAX",
    body: `
      <p><strong>URGENT: Fraud Report Confirmation Required</strong></p>
      <p>You have initiated a fraud report against a company on the RentFAX platform.</p>
      <p>To finalize this report, you must click the link below. This link is valid for 10 minutes.</p>
      <p><a href="${confirmationUrl}" style="font-weight: bold; color: red;">Confirm Fraud Report</a></p>
      <p><strong>Warning:</strong> Filing a fraud report is a serious action that will trigger a review. If you did not intend to do this, please ignore this email.</p>
      <p>Thank you,<br/>The RentFAX Security Team</p>
    `
  };
}

export async function sendConfirmationEmail(email: string, actionType: 'NO' | 'FRAUD', token: string): Promise<void> {
    const { subject, body } = getEmailContent(actionType, token);

    console.log('--- SENDING CONFIRMATION EMAIL ---');
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`ACTION: ${actionType}`);
    console.log(`TOKEN: ${token}`);
    console.log('BODY:', body.replace(/\n/g, '').trim());
    console.log('------------------------------------');

    // Mock sending email. In a real app, this would be an API call to your email provider.
    // e.g., await resend.emails.send({ from: 'onboarding@resend.dev', to: email, subject, html: body });
    
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    return;
}

export async function sendConfirmationSms(phoneNumber: string, actionType: 'NO' | 'FRAUD', token: string): Promise<void> {
    const confirmationUrl = `${BASE_URL}/confirm/${token}`;
    let messageBody = '';

    if (actionType === 'NO') {
        messageBody = `RentFAX: Please confirm you are NOT renting. This link expires in 15 mins. ${confirmationUrl}`;
    } else {
        messageBody = `RentFAX URGENT: Confirm FRAUD report. This link expires in 10 mins. ${confirmationUrl}`;
    }

    console.log('--- SENDING CONFIRMATION SMS ---');
    console.log(`TO: ${phoneNumber}`);
    console.log(`MESSAGE: ${messageBody}`);
    console.log('------------------------------------');

    // Mock sending SMS via Twilio, etc.
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
}
