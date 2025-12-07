import { sendEmail } from "@/lib/notifications/email";
import { sendSMS } from "@/lib/notifications/sms";

export async function POST(req: Request) {
  const { type, toEmail, toPhone, subject, message } = await req.json();

  if (toEmail) await sendEmail({ to: toEmail, subject, html: message });
  if (toPhone) await sendSMS(toPhone, message);

  return Response.json({ success: true });
}
