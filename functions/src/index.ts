import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// TODO: Configure your email transport (e.g., using Nodemailer with an SMTP service)

export const onDisputeCreated = functions.firestore
  .document("disputes/{disputeId}")
  .onCreate(async (snap, context) => {
    const dispute = snap.data();

    // TODO: Replace with your admin email address
    const adminEmail = "admin@example.com";

    const mailOptions = {
      from: "disputes@your-app.com",
      to: adminEmail,
      subject: `New Dispute Submitted: ${dispute.id}`,
      html: `
        <h1>A new dispute has been submitted.</h1>
        <p><strong>Dispute ID:</strong> ${dispute.id}</p>
        <p><strong>Renter ID:</strong> ${dispute.renterUid}</p>
        <p><strong>Description:</strong></p>
        <p>${dispute.description}</p>
        <p>Please log in to the admin dashboard to review the details.</p>
      `,
    };

    try {
      // TODO: Send the email using your configured transport
      console.log("Email sent to:", adminEmail);
      return null;
    } catch (error) {
      console.error("There was an error sending the email:", error);
      return null;
    }
  });
