import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn(
    "SENDGRID_API_KEY is not set. Email functionality will be disabled.",
  );
}

interface DisputeStatusUpdateEmailProps {
  email: string;
  renterName: string;
  id: string;
  newStatus: "approved" | "rejected" | "pending";
  adminNotes?: string;
}

export async function sendDisputeStatusUpdateEmail({
  email,
  renterName,
  id,
  newStatus,
  adminNotes = "No additional notes provided.",
}: DisputeStatusUpdateEmailProps) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Skipping email: SENDGRID_API_KEY not set.");
    return;
  }

  const renterDisputesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/renter/disputes`; // Assuming a page exists here

  const subjectLines = {
    approved: "Your Dispute Has Been Approved",
    rejected: "Your Dispute Has Been Rejected",
    pending: "Your Dispute is Under Review",
  };

  const messageBody = {
    approved: `Your dispute (ID: ${id.substring(0, 8)}...) has been reviewed and **approved**. The original incident report has been updated accordingly.`,
    rejected: `Your dispute (ID: ${id.substring(0, 8)}...) has been reviewed and **rejected**. The original incident report will be upheld.`,
    pending: `Your dispute (ID: ${id.substring(0, 8)}...) is now under review by our team. We will notify you once a decision has been made.`,
  };

  const msg = {
    to: email,
    from: "support@rentfax.co", // Must be a verified sender
    subject: subjectLines[newStatus],
    html: `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto;">
        <h2>Dispute Status Update</h2>
        <p>Hello ${renterName},</p>
        <p>${messageBody[newStatus]}</p>
        <div style="background-color: #f2f2f2; border-left: 4px solid #ccc; padding: 15px; margin: 20px 0;">
          <p style="font-weight: bold;">Administrator's Notes:</p>
          <p>${adminNotes}</p>
        </div>
        <p>
          You can view the full details and history of your disputes by logging into your dashboard.
        </p>
        <a 
          href="${renterDisputesUrl}"
          style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          View Your Disputes
        </a>
        <p style="font-size: 0.8em; color: #aaa; margin-top: 20px;">
          &copy; RentFAX Inc.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(
      `Dispute status update email sent to ${email} for status ${newStatus}.`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to send dispute status update email:",
        error.message,
      );
    } else {
      console.error(
        "An unknown error occurred while sending dispute status update email",
      );
    }
  }
}
