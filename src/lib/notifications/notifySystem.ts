import { createNotification } from "./createNotification";
import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSMS";
import { systemAlertTemplate } from "./templates/systemAlert";

export async function notifySystem(user, data) {
  // In-App
  await createNotification(user.uid, {
    type: "system",
    title: data.title,
    message: data.message,
  });

  // Email
  if (user.email) {
    await sendEmail(
      user.email,
      data.title,
      systemAlertTemplate(data)
    );
  }

  // SMS
  if (user.phone) {
    await sendSMS(user.phone, `${data.title}: ${data.message}`);
  }
}
