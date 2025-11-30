import { sendEmail } from "@/lib/email/send";
import renterVerifiedTemplate from "@/lib/email/templates/renterVerified";
import renterFailedTemplate from "@/lib/email/templates/renterFailed";

export async function sendLandlordNotification({ phone, status, details }) {
  const subject =
    status === "Verified"
      ? "Renter Verification Completed"
      : "Renter Verification Failed";

  const html =
    status === "Verified"
      ? renterVerifiedTemplate({ phone, details })
      : renterFailedTemplate({ phone, details });

  await sendEmail({
    to: "landlord@placeholder.com", // TODO: load from Firestore relationship
    subject,
    html,
  });
}
