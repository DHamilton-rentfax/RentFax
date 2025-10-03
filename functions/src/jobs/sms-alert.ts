import * as functions from "firebase-functions";
import * as twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsAlert = functions.pubsub.topic('sms-alerts').onPublish(async (message) => {
    const alertMessage = message.data ? Buffer.from(message.data, 'base64').toString() : 'Default alert message';

    try {
        await twilioClient.messages.create({
            body: alertMessage,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: process.env.YOUR_PHONE_NUMBER,   // Your phone number
        });
        console.log('SMS alert sent successfully.');
    } catch (error) {
        console.error('Error sending SMS alert:', error);
    }
});
