import { sendEmail } from "@/lib/email/send";
import renterVerifiedTemplate from "@/lib/email/templates/renterVerified";
import renterFailedTemplate from "@/lib/email/templates/renterFailed";

export async function sendCompanyNotification({ phone, status, details }) {
  const subject =
    status === "Verified"
      ? "Renter Verification Completed"
      : "Renter Verification Failed";

  const html =
    status === "Verified"
      ? renterVerifiedTemplate({ phone, details })
      : renterFailedTemplate({ phone, details });

  await sendEmail({
    to: "company@placeholder.com", // TODO: connect to company->renter relationship
    subject,
    html,
  });
}
