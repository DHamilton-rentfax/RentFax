import { createNotification } from "./createNotification";
import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSMS";
import { disputeSubmittedTemplate } from "./templates/disputeSubmitted";

export async function notifyDispute(user, dispute) {
  // In-App
  await createNotification(user.uid, {
    type: "dispute",
    title: "Dispute Submitted",
    message: `A dispute has been submitted for incident ${dispute.incidentId}.`,
    link: `/dashboard/disputes/${dispute.id}`,
    metadata: { disputeId: dispute.id, incidentId: dispute.incidentId }
  });

  // Email
  if (user.email) {
    await sendEmail(
      user.email,
      "Dispute Submitted",
      disputeSubmittedTemplate({
        incidentId: dispute.incidentId,
        renterName: dispute.renterName,
        disputeId: dispute.id
      })
    );
  }

  // SMS
  if (user.phone) {
    await sendSMS(user.phone, `A dispute has been submitted for incident ${dispute.incidentId}.`);
  }
}
