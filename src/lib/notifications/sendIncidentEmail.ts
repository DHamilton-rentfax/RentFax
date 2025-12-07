
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/email";

export async function sendIncidentEmail({ renterId, incidentId, category }) {
  const renter = await adminDb.collection("renters").doc(renterId).get();
  const data = renter.data();

  if (!data?.email) return;

  await sendEmail({
    to: data.email,
    subject: "A New Incident Has Been Reported",
    html: `
      <p>Hello ${data.fullName || "Renter"},</p>
      <p>An incident was recently filed regarding your rental activity.</p>
      <p>Category: <strong>${category}</strong></p>
      <p>You may view or dispute this incident in your RentFAX dashboard.</p>
    `,
  });
}
