import { createNotification } from "./createNotification";
import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSMS";
import { verificationRequestTemplate } from "./templates/verificationRequest";

export async function notifyVerification(user, token) {
  // In-App
  await createNotification(user.uid, {
    type: "identity",
    title: "Identity Verification Required",
    message: "Please verify your identity to continue.",
    link: `/verify-identity?token=${token}`,
    metadata: { token }
  });

  // Email
  if (user.email) {
    await sendEmail(
      user.email,
      "Identity Verification Required",
      verificationRequestTemplate({ token })
    );
  }

  // SMS
  if (user.phone) {
    await sendSMS(user.phone, `Please verify your identity to continue: ${process.env.APP_URL}/verify-identity?token=${token}`);
  }
}
