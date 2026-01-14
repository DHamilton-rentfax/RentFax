import { sendRenterEmail, sendRenterSMS } from "@/lib/notifications";

// This is a placeholder for the actual updateDispute function logic.
// The following lines are to be integrated into the existing updateDispute function.

export async function updateDispute(renterEmail: string, renterPhone: string | undefined, status: string) {
  // Assume dispute update logic is here

  await sendRenterEmail({
    to: renterEmail,
    subject: "Your RentFAX dispute was updated",
    html: `<p>Status updated to <strong>${status}</strong>.</p>`,
  });

  if (renterPhone) {
    await sendRenterSMS({
      to: renterPhone,
      message: `Your RentFAX dispute status is now: ${status}`,
    });
  }
}
