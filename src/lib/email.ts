import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendReportEmailProps {
  to: string;
  reportUrl?: string;
  reportId?: string;
  renterName?: string;
}

/**
 * Sends a renter report email using Resend.
 * @param {SendReportEmailProps} props - The properties for the email.
 */
export async function sendReportEmail({
  to,
  reportUrl,
  reportId,
  renterName,
}: SendReportEmailProps) {
  try {
    const subject = `Your RentFAX Report ${reportId ? `#${reportId}` : ""}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">
        <h2 style="color:#1A2540;">RentFAX Report Ready</h2>
        <p>Hello${renterName ? ` ${renterName}` : ""},</p>
        <p>Your renter report has been generated and is now available.</p>
        ${
          reportUrl
            ? `<p><a href="${reportUrl}" style="background:#1A2540;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">View Your Report</a></p>`
            : ""
        }
        <p>If you have any questions, contact <a href="mailto:info@rentfax.io">info@rentfax.io</a>.</p>
        <p style="margin-top:40px;font-size:12px;color:#888;">© ${new Date().getFullYear()} RentFAX, Inc.</p>
      </div>
    `;

    await resend.emails.send({
      from: "reports@rentfax.io", // This will be updated once your domain is verified in Resend
      to,
      subject,
      html,
    });

    console.log(`✅ Report email sent successfully to: ${to}`);
  } catch (err: any) {
    console.error("❌ Error sending report email:", err.message);
    // Optional: Add more robust error handling, e.g., logging to a dedicated service
  }
}
