import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Configure SendGrid
// Set in your Firebase environment config:
// firebase functions:config:set sendgrid.key="YOUR_API_KEY" admin.email="your-admin@email.com"
if (functions.config().sendgrid && functions.config().sendgrid.key) {
  sgMail.setApiKey(functions.config().sendgrid.key);
} else {
  console.warn("SendGrid API key not configured. Email notifications will be disabled.");
}

export const onDisputeCreated = functions.firestore
  .document("renters/{renterId}/disputes/{disputeId}")
  .onCreate(async (snap, context) => {
    const dispute = snap.data();
    if (!dispute) {
      console.log("No dispute data to process.");
      return;
    }

    const { renterId, disputeId } = context.params;

    const adminEmail = functions.config().admin?.email;

    if (!adminEmail) {
      console.error("Admin email is not configured. Cannot send notification. Set config: admin.email");
      return;
    }

    const mailOptions = {
      from: "disputes@your-app.com", // Must be a verified sender in SendGrid
      to: adminEmail,
      subject: `New Dispute Submitted: ${disputeId}`,
      html: `
        <h1>A new dispute has been submitted.</h1>
        <p><strong>Dispute ID:</strong> ${disputeId}</p>
        <p><strong>Renter ID:</strong> ${renterId}</p>
        <p><strong>Message:</strong></p>
        <p>${dispute.message}</p>
        <p>Please log in to the admin dashboard to review the details.</p>
      `,
    };

    if (functions.config().sendgrid && functions.config().sendgrid.key) {
      try {
        await sgMail.send(mailOptions);
        console.log(`Dispute notification email sent to ${adminEmail}`);
      } catch (error) {
        console.error("Error sending dispute notification email:", error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    } else {
      console.log("Email not sent because SendGrid is not configured.");
    }
  });
