// ===========================================
// RentFAX | Generic Notification Sender API
// Location: src/app/api/notifications/send/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";

// In a real app, you would use a service like SendGrid, Postmark, or AWS SES
async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  console.log("--- MOCK EMAIL SENDER ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log("-------------------------");
  // Mocked response
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, messageId: `msg_${Math.random().toString(36).substr(2, 9)}` };
}

export async function POST(req: Request) {
  try {
    const { userId, template, data } = await req.json();

    if (!userId || !template) {
      return NextResponse.json({ success: false, error: "Missing userId or template" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const email = userData.email;
    let subject = "";
    let body = "";

    // 1. Select the email template
    switch (template) {
      case "rental_review_prompt":
        subject = `Action Required: Submit Review for Renter ${data.renterName}`;
        body = `Hi ${userData.name || ''}, the lease for ${data.renterName} has ended. Please take a moment to complete their rental behavior review on RentFAX.`;
        break;
      case "report_ready":
        subject = `Your RentFAX Report is Ready: ${data.reportId}`;
        body = `The report you requested for ${data.renterName} has been generated successfully. You can view it in your dashboard.`;
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid template" }, { status: 400 });
    }

    // 2. Send the email (mocked)
    const emailResult = await sendEmail({ to: email, subject, body });

    if (!emailResult.success) {
      throw new Error("Failed to send email");
    }

    // 3. Log the notification for auditing
    await addDoc(collection(db, "notificationLogs"), {
      userId,
      email,
      template,
      status: "sent",
      sentAt: Timestamp.now(),
      providerMessageId: emailResult.messageId,
      data, // Store context data
    });

    return NextResponse.json({ success: true, messageId: emailResult.messageId });

  } catch (err: any) {
    console.error("Notification API Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
