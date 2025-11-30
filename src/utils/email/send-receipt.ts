
import { resend } from "@/lib/email/resend";
import { EmailReceiptTemplate } from "@/components/email/EmailReceiptTemplate";

export default async function sendReceiptEmail({
  to,
  type,
  amount,
  renterName,
  userName,
  reportUrl,
}: {
  to: string;
  type: "identity-check" | "full-report";
  amount: number;
  renterName: string;
  userName: string;
  reportUrl?: string | null;
}) {
  try {
    await resend.emails.send({
        to,
        from: "RentFAX <notifications@rentfax.io>",
        subject:
        type === "identity-check"
            ? `Receipt: Renter Identity Check`
            : `Receipt: Full RentFAX Report`,
        react: EmailReceiptTemplate({
        type,
        amount,
        renterName,
        userName,
        reportUrl,
        }),
    });
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    // Do not re-throw, as this is a non-critical part of the flow
  }
}
