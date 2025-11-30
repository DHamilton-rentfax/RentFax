import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";

// A placeholder for your actual email sending service
async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string; }) {
    console.log(`Sending email to ${to}: ${subject} - ${text}`);
    // In a real application, you would integrate with a service like SendGrid, Postmark, or AWS SES.
    return Promise.resolve();
}

export async function GET() {
    try {
        const usersSnapshot = await adminDB.collection("users").get();

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const user = userDoc.data();

            if (user.email) {
                const creditsDoc = await adminDB.collection("credits").doc(userId).get();
                const credits = creditsDoc.data()?.count ?? 0;

                if (credits < 5) {
                    await sendEmail({
                        to: user.email,
                        subject: "You're running low on RentFAX credits",
                        text: `Hi ${user.displayName || 'there'},

You have less than 5 credits remaining in your RentFAX account. To avoid any interruptions in your service, please purchase more credits.

Thanks,
The RentFAX Team`
                    });
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in low credit check cron job:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
