
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

if (!admin.apps.length) {
    admin.initializeApp();
}

sgMail.setApiKey(functions.config().sendgrid.key);

export const sendInviteEmail = functions.firestore
  .document("invites/{inviteId}")
  .onCreate(async (snap, context) => {
    const invite = snap.data();
    if (!invite) return;

    const { email, role, token } = invite;
    const appUrl = process.env.APP_URL || "http://localhost:9002"; // Fallback for local dev
    const link = `${appUrl}/invite/${token}`;

    const msg = {
      to: email,
      from: "noreply@rentfax.ai", // This must be a verified sender in your SendGrid account
      subject: `You're invited to join RentFAX as a ${role}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #3F51B5;">Welcome to RentFAX!</h2>
            <p>You’ve been invited to join the RentFAX team as a <strong>${role}</strong>.</p>
            <p>Click the button below to accept your invitation and set up your account. This link will expire in 7 days.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#3F51B5;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Accept Invite</a>
            </p>
            <p>If the button doesn’t work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #555;">${link}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p style="font-size:12px;color:#888;">This invite was sent automatically from the RentFAX platform.</p>
          </div>
        </div>
      `,
    };

    try {
        await sgMail.send(msg);
        console.log(`Invite email sent successfully to ${email}`);
    } catch(error) {
        console.error("Error sending invite email:", error);
        // If you have error logging set up (e.g., Sentry), you'd log it here.
    }
  });
