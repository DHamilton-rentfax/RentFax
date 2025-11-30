import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";

admin.initializeApp();
const db = admin.firestore();

// Configure your alert mailbox
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

// v2 Firestore trigger with corrected imports and syntax
export const oncomplianceflagcreate = onDocumentCreated("complianceFlags/{flagId}", async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.error("onComplianceFlagCreate: No data associated with the event");
      return;
    }

    const data = snap.data();

    if (!data || !data.userId) {
        logger.error('onComplianceFlagCreate: Document data is missing or malformed.', data);
        return;
    }

    const subject = `🚨 RentFAX Compliance Flag - ${data.userId}`;
    const message = `
A file upload has been flagged for potential HIPAA or health-related content.

User ID: ${data.userId}
File Path: ${data.filePath}
Reason: ${data.reason}
Confidence: ${(data.confidence * 100).toFixed(0)}%
Timestamp: ${new Date().toISOString()}

Please review this file in the Admin Compliance Dashboard.
`;

    try {
        await transporter.sendMail({
          from: `"RentFAX Compliance" <${process.env.ALERT_EMAIL_USER}>`,
          to: "compliance@rentfax.io, founder@rentfax.io",
          subject,
          text: message,
        });

        logger.info(`Compliance alert email sent for user: ${data.userId}`);

        await db.collection("auditLogs").add({
          type: "COMPLIANCE_ALERT_SENT",
          userId: data.userId,
          reason: data.reason,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        logger.info(`Audit log created for compliance alert: ${data.userId}`);

    } catch (error) {
        logger.error("onComplianceFlagCreate: Error sending email or creating audit log:", error);
    }
});
