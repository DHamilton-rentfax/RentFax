import { createNotification } from "./createNotification";
import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSMS";
import { fullReportUnlockedTemplate } from "./templates/fullReportUnlocked";

export async function notifyReportUnlock(user, report) {
  // In-App
  await createNotification(user.uid, {
    type: "billing",
    title: "Full Report Unlocked",
    message: `The full report for ${report.renterName} has been unlocked.`,
    link: `/reports/${report.id}`,
    metadata: { reportId: report.id }
  });

  // Email
  if (user.email) {
    await sendEmail(
      user.email,
      "Full Report Unlocked",
      fullReportUnlockedTemplate({
        renterName: report.renterName,
        reportId: report.id
      })
    );
  }

  // SMS
  if (user.phone) {
    await sendSMS(user.phone, `Full RentFAX report for ${report.renterName} unlocked.`);
  }
}
