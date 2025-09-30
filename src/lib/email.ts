
// A mock email service for development

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  console.log('Sending email:');
  console.log(`  To: ${options.to}`);
  console.log(`  Subject: ${options.subject}`);
  console.log(`  Body: ${options.html}`);
  // In a real application, this would use a service like SendGrid or Postmark
  return Promise.resolve();
}
