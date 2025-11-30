import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { sendLandlordNotification } from "@/lib/notifications/sendLandlordNotification";
import { sendCompanyNotification } from "@/lib/notifications/sendCompanyNotification";
import { sendAdminMonitorNotification } from "@/lib/notifications/sendAdminMonitorNotification";
import { logAuditEvent } from "@/lib/monitoring/audit";

export async function onVerificationComplete({ phone, status, details, metadata: { userId } }: { phone: string; status: string; details: any; metadata: { userId: string } }) {
    const ref = db.collection("renterVerification").doc(phone);

    await ref.set(
        {
            status,
            details,
            userId,
            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    await logAuditEvent({
        type: "VERIFICATION_COMPLETED",
        userId,
        metadata: { phone, status },
    });

    if (status === "Verified" || status === "Failed") {
        await sendLandlordNotification({ phone, status, details });
        await sendCompanyNotification({ phone, status, details });
    }

    await sendAdminMonitorNotification({ phone, status, details });
}
