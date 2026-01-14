import { sendRenterEmail, sendRenterSMS } from "@/lib/notifications";
import { logAudit } from "@/lib/audit";

// This is a placeholder for the actual createReport function logic.
// The following lines are to be integrated into the existing createReport function.

export async function createReport(reportNameId: string, companyId: string, renterEmail: string, renterPhone: string | undefined) {
  // Assume report creation logic is here

  await sendRenterEmail({
    to: renterEmail,
    subject: "A RentFAX report was created",
    html: `
      <p>A report has been filed involving you.</p>
      <p>You may review and dispute it by signing in to RentFAX.</p>
    `,
  });

  if (renterPhone) {
    await sendRenterSMS({
      to: renterPhone,
      message:
        "A RentFAX report was created involving you. Log in to review or dispute.",
    });
  }

  await logAudit({
    action: "NOTIFY_RENTER_REPORT_CREATED",
    actorId: companyId,
    actorRole: "COMPANY",
    targetType: "REPORT",
    targetId: reportNameId,
  });
}
