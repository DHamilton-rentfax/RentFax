export function renterVerificationSubmittedTemplate(name: string) {
  return {
    subject: "Your RentFAX Verification Has Been Submitted",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>Thank you for submitting your identity verification to RentFAX.</p>

        <p>Your documents have been securely received and are now pending review.</p>

        <h3>What Happens Next?</h3>
        <ul>
          <li>Our verification team will review your submission.</li>
          <li>You will receive an email once your identity is approved or if more information is required.</li>
          <li>Verification helps ensure trust, fairness, and data accuracy across the RentFAX platform.</li>
        </ul>

        <p style="margin-top:20px;">Thank you,<br/>The RentFAX Verification Team</p>
      </div>
    `,
  };
}

export function adminVerificationSubmittedTemplate(data: any) {
  return {
    subject: "New Identity Verification Submitted",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Verification Submitted</h2>
        <p>A renter has submitted their identity verification.</p>

        <h3>Renter Details</h3>
        <ul>
          <li><strong>Name:</strong> ${data.renter?.fullName}</li>
          <li><strong>Email:</strong> ${data.renter?.email || "N/A"}</li>
          <li><strong>Phone:</strong> ${data.renter?.phone || "N/A"}</li>
          <li><strong>Verification ID:</strong> ${data.id}</li>
          <li><strong>Status:</strong> pending</li>
        </ul>

        <p style="margin-top:20px;">
          Visit the Admin Verification Dashboard to review this submission.
        </p>
      </div>
    `,
  };
}
