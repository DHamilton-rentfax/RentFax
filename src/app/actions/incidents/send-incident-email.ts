"use server";

import { sendEmail } from "@/lib/email/resend";
import { IncidentCreatedEmail } from "@/emails/IncidentCreatedEmail";
import { getAdminDb } from "@/firebase/server";

export async function sendIncidentCreatedEmail({
  renterId,
  incidentId,
}: {
  renterId: string;
  incidentId: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const db = adminDb;

  // Fetch renter details
  const renterDoc = await db.collection("renters").doc(renterId).get();
  if (!renterDoc.exists) throw new Error("Renter not found");

  const renter = renterDoc.data();
  if (!renter) throw new Error("Renter data is missing");
  const email = renter.email;
  const renterName = renter.name || "Renter";

  // Fetch incident details
  const incidentDoc = await db.collection("incidents").doc(incidentId).get();
  if (!incidentDoc.exists) throw new Error("Incident not found");

  const incident = incidentDoc.data();
  if (!incident) throw new Error("Incident data is missing");

  return await sendEmail({
    to: email,
    subject: "A new incident has been added to your RentFAX profile",
    react: IncidentCreatedEmail({
      renterName,
      incidentType: incident.type,
      incidentDescription: incident.description,
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/portal/incidents`,
    }),
  });
}
