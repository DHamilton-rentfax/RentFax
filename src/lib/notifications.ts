
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  // In a real app, you'''d use a service like SendGrid, Postmark, or AWS SES
  console.log(`--- SENDING EMAIL to ${to} ---`);
  console.log(`Subject: ${subject}`);
  return Promise.resolve();
}

export async function sendSMS(to: string, body: string) {
  // In a real app, you'''d use a service like Twilio or Vonage
  console.log(`--- SENDING SMS to ${to} ---`);
  console.log(`Body: ${body}`);
  return Promise.resolve();
}
