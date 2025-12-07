import { adminDb } from "@/firebase/server";

// This is a placeholder for your email sending service (e.g., SendGrid, Mailgun)
async function sendEmail(to: string, subject: string, body: string) {
  console.log(`
    --- SENDING EMAIL ---
    TO: ${to}
    SUBJECT: ${subject}
    BODY: ${body}
    ---------------------
  `);
  // In a real application, you would integrate your email service here.
  // For example, using Nodemailer with an SMTP transport, or an API client for a service like SendGrid.
  return Promise.resolve();
}

export async function sendUsageAlertEmail(companyId: string, level: "warning" | "limit_exceeded", details: string) {
  const usersSnap = await adminDb
    .collection("users")
    .where("companyId", "==", companyId)
    .where("role", "in", ["admin", "owner"])
    .get();

  if (usersSnap.empty) {
    return;
  }

  const companyDoc = await adminDb.collection("companies").doc(companyId).get();
  const companyName = companyDoc.data()?.name || "Your Company";

  for (const userDoc of usersSnap.docs) {
    const user = userDoc.data();
    if (!user.email) continue;

    let subject, body;

    if (level === "warning") {
      subject = `RentFAX Usage Warning for ${companyName}`;
      body = `
        <p>Hello ${user.name || "Admin"},</p>
        <p>This is a warning that your company, ${companyName}, is projected to exceed usage limits for your current plan.</p>
        <p>Details: ${details}</p>
        <p>We recommend upgrading your plan to avoid service interruptions.</p>
        <p>Thank you,</p>
        <p>The RentFAX Team</p>
      `;
    } else {
      subject = `RentFAX Action Required: Usage Limit Exceeded for ${companyName}`;
      body = `
        <p>Hello ${user.name || "Admin"},</p>
        <p>Your company, ${companyName}, has exceeded a usage limit on your current plan, and the service may be temporarily paused.</p>
        <p>Details: ${details}</p>
        <p>To continue using our services without interruption, please upgrade your plan immediately.</p>
        <p>Thank you,</p>
        <p>The RentFAX Team</p>
      `;
    }

    await sendEmail(user.email, subject, body);
  }
}
