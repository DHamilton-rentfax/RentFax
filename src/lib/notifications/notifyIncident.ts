import { createNotification } from "./createNotification";
import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSMS";
import { incidentCreatedTemplate } from "./templates/incidentCreated";

export async function notifyIncident(user, incident) {
  // In-App
  await createNotification(user.uid, {
    type: "incident",
    title: "New Incident Report",
    message: `${incident.type} incident created.`,
    link: `/dashboard/incidents/${incident.id}`,
    metadata: { incidentId: incident.id }
  });

  // Email
  if (user.email) {
    await sendEmail(
      user.email,
      "New Incident Report Created",
      incidentCreatedTemplate({
        renterName: incident.renterName,
        type: incident.type,
        amount: incident.amount,
        incidentId: incident.id
      })
    );
  }

  // SMS
  if (user.phone) {
    await sendSMS(user.phone, `New incident report created for ${incident.renterName}.`);
  }
}
