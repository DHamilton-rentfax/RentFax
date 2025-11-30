import twilio from "twilio";
import { getUserPhone } from "./userLookup";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export async function sendSMS({ toUserId, message }) {
  const phone = await getUserPhone(toUserId);
  if (!phone) return;

  await client.messages.create({
    body: message,
    to: phone,
    from: process.env.TWILIO_FROM
  });
}
