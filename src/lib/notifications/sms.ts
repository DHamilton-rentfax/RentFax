import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_TOKEN!
);

export async function sendSMS(to: string, message: string) {
  return await client.messages.create({
    to,
    from: process.env.TWILIO_PHONE!,
    body: message,
  });
}
