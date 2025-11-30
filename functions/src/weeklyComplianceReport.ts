import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

// v2 scheduled function
export const weeklycompliancereport = onSchedule("0 8 * * 1", async (event) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const snap = await db
    .collection("complianceFlags")
    .where("timestamp", ">", oneWeekAgo)
    .get();

  const count = snap.size;
  if (count === 0) {
    logger.info("No compliance flags in the last week. No report sent.");
    return;
  }

  let report = `Weekly Compliance Summary (${new Date().toDateString()})\n\n`;
  report += `Total flagged uploads: ${count}\n\n`;

  snap.forEach((doc) => {
    const d = doc.data();
    report += `• User: ${d.userId} | Reason: ${d.reason} | Confidence: ${(d.confidence * 100).toFixed(
      0
    )}% | Status: ${d.status}\n`;
  });

  try {
    await transporter.sendMail({
      from: `"RentFAX Compliance" <${process.env.ALERT_EMAIL_USER}>`,
      to: "compliance@rentfax.io",
      subject: `🗓 Weekly Compliance Report (${count} Flags)`,
      text: report,
    });
    logger.info(`Weekly compliance report sent with ${count} flags.`);

    await db.collection("auditLogs").add({
      type: "WEEKLY_COMPLIANCE_REPORT_SENT",
      totalFlags: count,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    logger.info("Audit log created for weekly report.");

  } catch (error) {
    logger.error("weeklyComplianceReport: Error sending email or creating audit log:", error);
  }
});
