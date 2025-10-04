import * as functions from "firebase-functions";
import twilio from "twilio";

const twilioClient = new twilio.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsAlert = functions.pubsub.topic('sms-alerts').onPublish(async (message) => {
    const alertMessage = message.data ? Buffer.from(message.data, 'base64').toString() : 'Default alert message';
    const toPhoneNumber = process.env.YOUR_PHONE_NUMBER;

    if (!toPhoneNumber) {
        console.error('Error: YOUR_PHONE_NUMBER environment variable not set.');
        return;
    }

    try {
        await twilioClient.messages.create({
            body: alertMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: toPhoneNumber,
        });
        console.log('SMS alert sent successfully.');
    } catch (error) {
        console.error('Error sending SMS alert:', error);
    }
});
