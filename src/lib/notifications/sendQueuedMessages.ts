import { adminDb } from "@/firebase/server";
import { renderTemplate } from "@/lib/notifications/renderTemplate";

export async function sendQueuedMessages() {
  const snap = await adminDb
    .collection("notification_deliveries")
    .where("status", "==", "queued")
    .limit(50)
    .get();

  for (const doc of snap.docs) {
    const d = doc.data();

    try {
      const templateDoc = await adminDb
        .collection("message_templates")
        .doc(d.templateId)
        .get();

      if (!templateDoc.exists) {
        throw new Error("Template not found");
      }

      const tpl = templateDoc.data()!;
      const body = renderTemplate(tpl.body, d.variables || {});
      const subject = tpl.subject
        ? renderTemplate(tpl.subject, d.variables || {})
        : undefined;

      // 🔌 plug into your provider here
      // sendEmail() or sendSMS()

      await doc.ref.update({
        status: "sent",
        renderedBody: body,
        renderedSubject: subject || null,
        sentAt: new Date(),
        attempts: (d.attempts || 0) + 1,
      });
    } catch (err: any) {
      await doc.ref.update({
        status: "failed",
        error: err.message,
        attempts: (d.attempts || 0) + 1,
      });
    }
  }
}
