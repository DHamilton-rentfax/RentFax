import * as functions from "firebase-functions";
import { adminDB } from "../firebaseAdmin";
import { getStorage } from "firebase-admin/storage";
import sgMail from "@sendgrid/mail";
import { jsPDF } from "jspdf";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMonthlyReport = functions.pubsub
  .schedule("0 9 1 * *") // every 1st of month at 9 AM
  .timeZone("America/New_York")
  .onRun(async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    // Revenue + events aggregation
    const billingSnap = await adminDB
      .collection("billingEvents")
      .where("timestamp", ">=", startDate)
      .get();

    const eventsSnap = await adminDB
      .collection("analyticsEvents")
      .where("ts", ">=", startDate.getTime())
      .get();

    let totalRevenue = 0;
    billingSnap.forEach((doc) => {
      totalRevenue += doc.data().amount || 0;
    });

    // Create PDF
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("RentFAX Monthly Investor Report", 14, 20);

    pdf.setFontSize(12);
    pdf.text(`Period: ${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`, 14, 35);
    pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 45);
    pdf.text(`Events Logged: ${eventsSnap.size}`, 14, 55);

    eventsSnap.docs.slice(0, 15).forEach((doc, i) => {
      const e = doc.data();
      pdf.text(`${i + 1}. ${e.event} (${new Date(e.ts).toLocaleDateString()})`, 14, 70 + i * 8);
    });

    const pdfBuffer = pdf.output("arraybuffer");

    // Upload to Firebase Storage
    const bucket = getStorage().bucket();
    const fileName = `reports/investor_report_${new Date().toISOString().slice(0, 7)}.pdf`;
    const file = bucket.file(fileName);

    await file.save(Buffer.from(pdfBuffer), {
      contentType: "application/pdf",
      resumable: false,
      public: false,
    });

    // Save metadata in Firestore
    await adminDB.collection("reports").add({
      type: "monthly_investor",
      period: startDate,
      revenue: totalRevenue,
      events: eventsSnap.size,
      createdAt: new Date(),
      storagePath: fileName,
    });

    // Email investors
    await sgMail.send({
      to: process.env.INVESTOR_EMAILS!.split(","),
      from: "noreply@rentfax.ai",
      subject: "📊 RentFAX Monthly Investor Report",
      text: "Attached is the monthly investor report. You can also download it from your dashboard.",
      attachments: [
        {
          filename: "RentFAX_Monthly_Report.pdf",
          content: Buffer.from(pdfBuffer).toString("base64"),
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });

    console.log("Monthly report stored + emailed ✅");
    return null;
  });
