export function verificationRequestTemplate(data: any) {
  return `
    <h2>Identity Verification Request</h2>
    <p>Please verify your identity to continue.</p>
    <p><a href="${process.env.APP_URL}/verify-identity?token=${data.token}">
      Verify Identity
    </a></p>
  `;
}
