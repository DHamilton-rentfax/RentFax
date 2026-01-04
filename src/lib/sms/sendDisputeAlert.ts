import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendDisputeAlert(phone: string) {
  return client.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE!,
    body: "RentFAX: A dispute has been submitted and is under review.",
  });
}
