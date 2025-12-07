export function verificationFailedEmail(name: string) {
  return `
    <h2>Identity Verification Failed</h2>
    <p>Hello ${name},</p>
    <p>Your recent identity verification attempt was unsuccessful.</p>
    <p>Please try again or contact support if you believe this is an error.</p>
  `;
}
